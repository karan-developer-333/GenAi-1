/**
 * Graph Service
 * Bridges Pinecone semantic search with the graph transformer.
 */

const { pipeline } = require('@xenova/transformers');
const { getIndexHost } = require('../config/pinecone');
const { toGraph } = require('./graphTransformer');

let embedder;

async function getEmbedding(text) {
    if (!embedder) {
        embedder = await pipeline(
            'feature-extraction',
            'Xenova/all-MiniLM-L6-v2'
        );
    }
    const output = await embedder(text, {
        pooling: 'mean',
        normalize: true,
    });
    return Array.from(output.data);
}

/**
 * Run a semantic search against Pinecone with topK=10
 * and return D3-formatted graph data.
 *
 * @param {string} query
 * @returns {Promise<{ nodes: Array, links: Array }>}
 */
async function searchAndBuildGraph(query, userId) {
    const embedding = await getEmbedding(query);
    const host = await getIndexHost();

    const response = await fetch(`https://${host}/query`, {
        method: 'POST',
        headers: {
            'Api-Key': process.env.PINECONE_KEY || process.env.PINECONE_API_KEY,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            vector: embedding,
            topK: 10,
            includeMetadata: true,
            namespace: 'Data',
            filter: { userId: { "$eq": userId } }
        }),
    });

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`Pinecone API Error: ${err}`);
    }

    const data = await response.json();
    const matches = data.matches || [];

    return toGraph(query, matches);
}

module.exports = { searchAndBuildGraph };
