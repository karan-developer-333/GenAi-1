import { tavily } from '@tavily/core';
const client = tavily({ apiKey: process.env.TAVILY_API_KEY });

export const webSearch = async (query:string) => {
    const results = await client.search(query, {
        searchDepth: "basic",
        include_answer: true,
        max_results: 5
    });
    return results;
}
