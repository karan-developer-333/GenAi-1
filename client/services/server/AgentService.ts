import { Mistral } from '@mistralai/mistralai';
import { searchPinecone } from './PineconeService';
import Item from '../../models/Item';
import Conversation, { IMessage } from '../../models/Conversation';
import { webSearch } from '../../utils/webSearch';
import dbConnect from '../../lib/database';

const client = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY as string,
});

/* ---------------- WEB SEARCH ---------------- */

async function performWebSearch(query: string) {
  try {
    console.log(`[AGENT] 🌐 Tavily search: ${query}`);
    const response = await webSearch(query);
    const results = response.results || [];
    return {
      success: true,
      raw:
        (response.answer ? `--- TAVILY SUMMARY ---\n${response.answer}\n\n` : '') +
        results
          .map((r: any, i: number) => `[${i + 1}] ${r.title}\n${r.url}\n${r.content}`)
          .join('\n\n'),
    };
  } catch (e: any) {
    console.error("[AGENT] Search Error:", e);
    return { success: false, raw: `Web search error: ${e.message}` };
  }
}

/* ---------------- TOOLS CONFIG ---------------- */

const tools = [
  {
    type: 'function' as const,
    function: {
      name: 'search_web',
      description: 'Search live web for latest or current information.',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string' },
        },
        required: ['query'],
      },
    },
  },
];

/* ---------------- CHAT LOGIC ---------------- */

export async function chat(query: string, userId: string, conversationId?: string) {
  await dbConnect();
  const today = new Date().toDateString();

  // 1. Load or Create Conversation
  let conversation = conversationId 
    ? await Conversation.findOne({ _id: conversationId, userId }) 
    : null;

  if (!conversation) {
    conversation = new Conversation({
      userId,
      title: query.slice(0, 40),
      messages: [],
    });
  }

  // 2. Build Context (Pinecone + Recent Items)
  const pineconeResults = await searchPinecone({ query, userId });
  const recentItems = await Item.find({ userId }).sort({ timestamp: -1 }).limit(10);

  const semanticContext = (pineconeResults?.result?.hits || [])
    .map((h: any) => `- ${h.fields?.title}`).join('\n') || 'None';
  const recentContext = recentItems.map((i) => `- ${i.title}`).join('\n') || 'None';

  const systemPrompt = `You are MnemoAI. Today is ${today}.\n\nLibrary Context:\n${semanticContext}\n\nRecent Activity:\n${recentContext}`;

  // 3. Prepare Message History for Mistral
  // CRITICAL: We only include plain user and assistant messages from history
  // to prevent role mismatches, while still allowing tools in the current loop.
  const apiMessages: any[] = [{ role: 'system', content: systemPrompt }];

  for (const m of conversation.messages) {
    if (m.role === 'user') {
      apiMessages.push({ role: 'user', content: m.content || "" });
    } else if (m.role === 'assistant' && !m.tool_calls) {
      if (m.content) {
        apiMessages.push({ role: 'assistant', content: m.content });
      }
    }
  }

  const userMessage: IMessage = { role: 'user', content: query };
  apiMessages.push(userMessage);
  conversation.messages.push(userMessage);

  // 4. Recursive Tool Loop
  let safetyCounter = 0;
  let finalResponse = "";

  try {
    console.log("API MESSAGES :",apiMessages)
    let response = await client.chat.complete({
      model: 'mistral-small-latest',
      messages: apiMessages,
      tools,
      temperature: 0.3,
    });

    while (response.choices?.[0]?.message?.toolCalls && safetyCounter < 5) {
      safetyCounter++;
      const assistantMsg = response.choices[0].message;
      
      // Save the assistant's request to call tools
      const toolCalls = assistantMsg.toolCalls;
      const assistantHistoryMsg: IMessage = {
        role: 'assistant',
        content: typeof assistantMsg.content === 'string' ? assistantMsg.content : (assistantMsg.content ? JSON.stringify(assistantMsg.content) : "tool called"),
        tool_calls: toolCalls || undefined,
      };
      
      apiMessages.push(assistantHistoryMsg);
      // We do NOT save tool-call assistant messages to DB for history

      // Process each tool call
      for (const tc of (toolCalls || [])) {
        const args = typeof tc.function.arguments === 'string' 
          ? JSON.parse(tc.function.arguments) 
          : tc.function.arguments;

        let resultRaw = "Unknown tool";
        if (tc.function.name === 'search_web') {
          const searchRes = await performWebSearch(args.query);
          resultRaw = searchRes.raw;
        }

        const toolResponseMsg: IMessage = {
          role: 'system',
          content: "WEB SEARCH RESULTS ===> \n" + resultRaw,
        };

        apiMessages.push(toolResponseMsg);
        // We do NOT save tool results to DB for history
      }

      // Get new response from Mistral after providing tool results
      console.log("API MESSAGES 2 :",apiMessages)
      response = await client.chat.complete({
        model: 'mistral-small-latest',
        messages: apiMessages,
        tools,
        temperature: 0.3,
      });
    }

    let rawContent = response.choices?.[0]?.message?.content;
    finalResponse = typeof rawContent === 'string' ? rawContent : (rawContent ? JSON.stringify(rawContent) : "");
    const finalAssistantMsg: IMessage = { role: 'assistant', content: finalResponse };
    
    conversation.messages.push(finalAssistantMsg);
    await conversation.save();

    return {
      conversationId: conversation._id,
      answer: finalResponse,
    };

  } catch (error: any) {
    console.error("Mistral Chat Error:", error);
    throw new Error(error.message || "Failed to process chat");
  }
}