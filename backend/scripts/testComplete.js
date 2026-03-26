require('dotenv').config();
const itemService = require('../src/services/itemService');
const pinecone = require('../src/config/pinecone');

async function testIntegration() {
    console.log("Adding a new item to trigger Pinecone upload...");
    const newItem = {
        title: "Advanced AI Coding with Antigravity",
        selectedText: "Antigravity is a powerful agentic AI coding assistant designed by Google Deepmind.",
        url: "https://example.com/antigravity",
        sourceType: "article"
    };

    const saved = itemService.saveItem(newItem);
    console.log(`Item saved locally with ID: ${saved.id}`);

    // Wait a few seconds for the async upload to complete
    console.log("Waiting 5 seconds for Pinecone upload...");
    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log("Searching Pinecone for 'Deepmind'...");
    const results = await pinecone.searchPinecone("Deepmind");
    
    if (results && results.result && results.result.hits && results.result.hits.length > 0) {
        console.log("SUCCESS! Top hit in Pinecone:");
        console.log(JSON.stringify(results.result.hits[0], null, 2));
    } else {
        console.log("No results found in Pinecone. Check logs for errors.");
    }
}

testIntegration();
