const { tavily } = require('@tavily/core');
const client = tavily({ apiKey: process.env.TAVILY_API_KEY });

const webSearch = async (query) => {
    const results = await client.search(query, {
        searchDepth: "basic",
        include_answer: true,
        max_results: 5
    });
    return results;
}

module.exports = webSearch;