const { Mistral } = require('@mistralai/mistralai');
const pinecone = require('../config/pinecone');
const Item = require('../models/itemModel');
const webSearch = require('../utils/webSearch');

const client = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY,
});

/**
 * Real Web Search using Tavily AI Search (https://tavily.com)
 * Requires TAVILY_API_KEY in .env
 */
async function performWebSearch(query) {
  try {
    console.log(`[AGENT] 🌐 Performing Tavily search for: "${query}"`);
    
    const response = await webSearch(query)

    const results = response.results || [];
    const tavilyAnswer = response.answer;

    return {
      success: true,
      results: results.map(r => ({
        title: r.title,
        url: r.url,
        snippet: r.content,
        score: r.score
      })),
      raw: (tavilyAnswer ? `**Tavily AI Summary:** ${tavilyAnswer}\n\n` : "") +
           `**Web Results:**\n` +
           results.map(r => `• **${r.title}**\n  ${r.content}\n  Source: ${r.url}`).join('\n\n'),
    };
  } catch (error) {
    console.error('[AGENT] ❌ Tavily search error:', error.message);
    return {
      success: false,
      results: [],
      raw: `Web search encountered an error: ${error.message}`,
    };
  }
}

/**
 * Define tools that the AI can use
 */
const tools = [
  {
    type: 'function',
    function: {
      name: 'search_web',
      description: 'Search the live web for current information when user query requires real-time data or external sources. Use when your knowledge base doesn\'t have relevant answers.',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'The search query to perform on the web',
          },
        },
        required: ['query'],
      },
    },
  },
];

/**
 * Process tool calls from the model
 */
async function processToolCall(toolName, toolInput) {
  console.log(`[AGENT] 🔧 Processing tool: ${toolName}`, toolInput);
  
  if (toolName === 'search_web') {
    const result = await performWebSearch(toolInput.query);
    return result; // Return the full object
  }
  
  return { success: false, raw: 'Unknown tool', results: [] };
}

/**
 * Enhanced Unified Agent Chat with Function Calling
 */
async function chat(query, userId, conversationHistory = []) {
  try {
    console.log(`\n[AGENT] 📤 User Query: "${query}"`);

    // 1. Fetch Personal Knowledge Base
    console.log(`[AGENT] 🔍 Searching personal knowledge base...`);
    const pineconeResults = await pinecone.searchPinecone({ query, userId });
    const recentItems = await Item.find({ userId }).sort({ timestamp: -1 }).limit(10);

    const semanticContext = (pineconeResults?.result?.hits || [])
      .map(h => `- [Your Save] "${h.fields?.title || 'Untitled'}" (${new Date(h.fields?.timestamp).toLocaleDateString()})\n  URL: ${h.fields?.url}`)
      .join('\n');

    const recentContext = recentItems
      .map(i => `- "${i.title}" (saved ${new Date(i.timestamp).toLocaleDateString()})`)
      .join('\n');

    // 2. Enhanced System Prompt
    const systemPrompt = `You are "MnemoAI", an intelligent research assistant with access to the user's personal knowledge base and the live web.

CORE INSTRUCTIONS:
1. **Prioritize Personal Knowledge**: If relevant information exists in the user's saved items, cite it first with "According to your saved knowledge..." or "From your saves...".
2. **Use Web Search Wisely**: Call the search_web tool when:
   - User asks about current events, news, or real-time information
   - Your knowledge base doesn't have sufficient answers
   - User explicitly asks for "latest" or "recent" information
   - The query requires factual verification from current sources
3. **Connect the Dots**: Explain relationships between their saved knowledge and new web information
4. **Be Transparent**: Mention whether information comes from their saves or the web
5. **Format Well**: Use markdown with clear sections, bullet points, and links

TONE: Professional, helpful, concise. Be an expert research partner.
THESE ARE THE USERS ALL DATABASE SAVED ITEMS GIVE ANSWER TO USER ABOUT THESE YOU HAVE PERMISSION TO GIVE THIS INFO TO USER ALSO IF THE USER ASK ABOUT SAVE HE WAS ASKING ABOUT THE FOLLOWING DATA:
<userData>
${semanticContext || "❌ No relevant saved items found"}

RECENT SAVES (Last 10):
${recentContext || "❌ No recent saves"}
</userData>
`;

    // 3. Build Messages Array with Conversation History
    let messages = [...conversationHistory];
    
    // Add current user message
    messages.push({
      role:"user",
      content:systemPrompt
    })
    messages.push({
      role: 'user',
      content: query,
    });

    console.log(`[AGENT] 📨 Calling Mistral with function calling enabled...`);

    // 4. Stable API Call with Tools
    let response = await client.chat.complete({
      model: 'mistral-small-latest',
      messages: messages,
      tools: tools,
      system: systemPrompt,
      temperature: 0.7,
      maxTokens: 2000,
    });

    // 5. Handle Tool Calls (if any)
    let finalAnswer = '';
    const sources = {
      knowledge: [
        ...(pineconeResults?.result?.hits || []).map(h => ({
          title: h.fields?.title,
          url: h.fields?.url,
          type: 'semantic',
          date: h.fields?.timestamp,
        })),
        ...recentItems.map(i => ({
          title: i.title,
          url: i.url,
          type: 'recent',
          date: i.timestamp,
        })),
      ],
      web: [],
    };
    console.log(JSON.stringify(response, null, 2));

    // Process tool use in a loop (using standard choices/message/tool_calls)
    while (response.choices[0].message.tool_calls && response.choices[0].message.tool_calls.length > 0) {
      console.log(`[AGENT] 🛠️ Model requested tool use`);
      
      const assistantMessage = response.choices[0].message;
      messages.push(assistantMessage);

      for (const toolCall of assistantMessage.tool_calls) {
        const toolName = toolCall.function.name;
        const toolInput = typeof toolCall.function.arguments === 'string' 
            ? JSON.parse(toolCall.function.arguments) 
            : toolCall.function.arguments;

        const toolResponse = await processToolCall(toolName, toolInput);

        messages.push({
          role: 'tool',
          name: toolName,
          content: toolResponse.raw,
          tool_call_id: toolCall.id,
        });

        if (toolName === 'search_web' && toolResponse.success) {
          sources.web.push(...(toolResponse.results || []));
        }
      }

      // Call API again with tool result included
      console.log('[AGENT] 🔄 Calling Mistral again with tool results...');
      response = await client.chat.complete({
        model: 'mistral-small-latest',
        messages: messages,
        tools: tools,
        temperature: 0.7,
        maxTokens: 2000,
      });
    }

    // 6. Extract Final Answer
    finalAnswer = response.choices[0].message.content;

    console.log(`[AGENT] ✅ Response generated`);

    return {
      answer: finalAnswer,
      sources: sources,
      conversationHistory: [
        ...messages,
        {
          role: 'assistant',
          content: finalAnswer,
        },
      ],
      metadata: {
        model: 'mistral-medium-latest',
        tokensUsed: response.usage?.totalTokens || response.usage?.total_tokens,
        timestamp: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error('[AGENT] ❌ Chat error:', error);
    throw new Error(`Agent error: ${error.message}`);
  }
}

/**
 * Multi-turn Conversation Wrapper
 */
class MnemoAIAgent {
  constructor(userId) {
    this.userId = userId;
    this.conversationHistory = [];
  }

  async chat(query) {
    const result = await chat(query, this.userId, this.conversationHistory);
    this.conversationHistory = result.conversationHistory;
    return {
      answer: result.answer,
      sources: result.sources,
      metadata: result.metadata,
    };
  }

  clearHistory() {
    this.conversationHistory = [];
  }
}

module.exports = { chat, MnemoAIAgent, performWebSearch };