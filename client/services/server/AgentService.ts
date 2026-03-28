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

/* ---------------- CHAT LOGIC (STREAMING) ---------------- */

export async function chatStream(
  query: string,
  userId: string,
  conversationId: string | undefined,
  callbacks: {
    onSources: (sources: any) => void;
    onChunk: (text: string) => void;
    onConversationId: (id: string) => void;
  }
) {
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
    await conversation.save(); // Save early to get ID
  }

  callbacks.onConversationId(conversation._id.toString());

  // 2. Build Context (Pinecone + Recent Items)
  const pineconeResults = await searchPinecone({ query, userId });
  const recentItems = await Item.find({ userId }).sort({ timestamp: -1 }).limit(10);

  const semanticContext = (pineconeResults?.result?.hits || [])
    .map((h: any) => `- ${h.fields?.title}`).join('\n') || 'None';
  const recentContext = recentItems.map((i: any) => `- ${i.title}`).join('\n') || 'None';

  const systemPrompt = `You are MnemoAI. Today is ${today}.\n\nLibrary Context:\n${semanticContext}\n\nRecent Activity:\n${recentContext}`;

  const webSources: any[] = [];
  callbacks.onSources({
    knowledge: pineconeResults?.result?.hits?.map((h:any) => ({ title: h.fields?.title, url: h.fields?.url })) || [],
    web: webSources,
  });

  // 3. Prepare Message History for Mistral
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

  // 4. Recursive Tool Loop with Streaming
  let safetyCounter = 0;
  let finalResponse = "";

  try {
    while (safetyCounter < 5) {
      safetyCounter++;
      
      const stream = await client.chat.stream({
        model: 'mistral-small-latest',
        messages: apiMessages,
        tools: tools as any,
        temperature: 0.3,
      });

      let isToolPhase = false;
      let accToolCalls: Record<number, any> = {};

      for await (const chunk of stream) {
        const delta = chunk.data?.choices?.[0]?.delta;
        if (!delta) continue;

        if (delta.toolCalls && delta.toolCalls.length > 0) {
          isToolPhase = true;
          for (const tc of delta.toolCalls) {
            const idx = tc.index || 0;
            if (!accToolCalls[idx]) accToolCalls[idx] = { id: tc.id, function: { name: "", arguments: "" } };
            if (tc.function?.name) accToolCalls[idx].function.name = tc.function.name;
            if (tc.function?.arguments) accToolCalls[idx].function.arguments += tc.function.arguments;
          }
        }

        if (delta.content && !isToolPhase) {
          const contentStr = typeof delta.content === 'string' ? delta.content : JSON.stringify(delta.content);
          finalResponse += contentStr;
          callbacks.onChunk(contentStr);
        }
      }

      if (isToolPhase) {
        const toolCallsArr = Object.values(accToolCalls);
        apiMessages.push({
          role: 'assistant',
          content: "tool called",
          tool_calls: toolCallsArr as any[]
        } as IMessage);

        for (const tc of toolCallsArr as any[]) {
          let args: any = {};
          try {
            args = JSON.parse(tc.function.arguments);
          } catch (e) {
            console.error("Failed to parse tool args", tc.function.arguments);
          }

          let resultRaw = "Unknown tool";
          if (tc.function.name === 'search_web') {
            const searchRes = await performWebSearch(args.query || "");
            resultRaw = searchRes.raw;
            webSources.push({ title: args.query || "Web Search", url: "https://tavily.com" });
            
            callbacks.onSources({
              knowledge: pineconeResults?.result?.hits?.map((h:any) => ({ title: h.fields?.title, url: h.fields?.url })) || [],
              web: webSources,
            });
          }

          apiMessages.push({
            role: 'system',
            content: "WEB SEARCH RESULTS ===> \n" + resultRaw,
          });
        }
      } else {
        break; // Successfully streamed content, end loop
      }
    }

    
    conversation.messages.push({ role: 'assistant', content: finalResponse } as IMessage);
    await conversation.save();

  } catch (error: any) {
    console.error("Mistral Stream Error:", error);
    throw new Error(error.message || "Failed to process chat stream");
  }
}