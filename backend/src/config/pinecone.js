const { Pinecone } = require("@pinecone-database/pinecone");
const { pipeline } = require('@xenova/transformers');

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
        normalize: true
    });
    return Array.from(output.data);
}

// State to cache the index host to avoid repeated describeIndex calls
let cachedHost = null;

async function getIndexHost() {
    if (cachedHost) return cachedHost;
    const desc = await pc.describeIndex(indexName);
    cachedHost = desc.host;
    return cachedHost;
}

// Initialize Pinecone client
const pc = new Pinecone({
    apiKey: process.env.PINECONE_KEY || process.env.PINECONE_API_KEY 
});

// Configure the index name
const indexName = process.env.PINECONE_INDEX_NAME || "auto-index";

// Note: We'll use manual embeddings as integrated inference is proving unreliable
// but we'll try to keep the interface similar.

/**
 * Filter record to remove null values and ensure id is a string
 * as Pinecone doesn't support nulls in metadata/integrated fields.
 */
const prepareRecord = (data) => {
    const record = { ...data };
    
    // Ensure ID is a string and handle both id and _id
    const id = record.id || record._id || record.mongoId;
    if (id) {
        record.id = id.toString();
    }

    // Remove null values and potential circular refs/complex objects
    for (const [key, value] of Object.entries(record)) {
        if (value === null || typeof value === 'object' && key !== 'metadata') {
            if (key !== 'id') delete record[key];
        }
    }
    return record;
};

const uploadToPinecone = async (data) => {
    try {
        const records = Array.isArray(data) ? data : [data];
        const cleanRecords = records.map(prepareRecord);
        const host = await getIndexHost();
        
        const vectors = await Promise.all(cleanRecords.map(async (record) => {
            const textToEmbed = record.text || record.title || "";
            const values = await getEmbedding(textToEmbed);
            if (!record.id) return null;
            return {
                id: record.id,
                values: values,
                metadata: { 
                    id: record.id,
                    userId: record.userId || "",
                    title: record.title || "",
                    url: record.url || "",
                    imageUrl: record.imageUrl || "",
                    imageAlt: record.imageAlt || "",
                    type: record.type || "text",
                    sourceType: record.sourceType || "article",
                    tags: record.tags || ""
                }
            };
        }));

        const validVectors = vectors.filter(v => v !== null);
        if (validVectors.length > 0) {
            const response = await fetch(`https://${host}/vectors/upsert`, {
                method: "POST",
                headers: {
                    "Api-Key": process.env.PINECONE_KEY || process.env.PINECONE_API_KEY,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ vectors: validVectors, namespace: "Data" })
            });

            if (!response.ok) {
                const err = await response.text();
                throw new Error(`Pinecone API Error: ${err}`);
            }
            console.log(`[PINECONE] ${validVectors.length} records uploaded successfully!`);
        }
    } catch (error) {
        console.error("[PINECONE ERROR] Upload failed:", error.message);
    }
};

const searchPinecone = async (queryObject) => {
    try {
        const { query, userId } = queryObject;
        const embedding = await getEmbedding(query);
        const host = await getIndexHost();
        
        const response = await fetch(`https://${host}/query`, {
            method: "POST",
            headers: {
                "Api-Key": process.env.PINECONE_KEY || process.env.PINECONE_API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                vector: embedding,
                topK: 5,
                includeMetadata: true,
                namespace: "Data",
                filter: { userId: { "$eq": userId } }
            })
        });

        if (!response.ok) {
            const err = await response.text();
            throw new Error(`Pinecone API Error: ${err}`);
        }

        const data = await response.json();
        const transformedResult = {
            result: {
                hits: (data.matches || []).map(match => ({
                    id: match.id,
                    score: match.score,
                    fields: match.metadata
                }))
            }
        };
        
        console.log("[PINECONE] Data searched successfully!", transformedResult);
        return transformedResult;
    } catch (error) {
        console.error("[PINECONE ERROR] Search failed:", error.message);
        return null;
    }
};

const deleteFromPinecone = async (ids) => {
    try {
        const idArray = Array.isArray(ids) ? ids : [ids];
        const host = await getIndexHost();
        
        console.log(`[PINECONE] Deleting records: ${idArray.join(', ')}`);
        
        const response = await fetch(`https://${host}/vectors/delete`, {
            method: "POST",
            headers: {
                "Api-Key": process.env.PINECONE_KEY || process.env.PINECONE_API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ ids: idArray, namespace: "Data" })
        });

        if (!response.ok) {
            const err = await response.text();
            throw new Error(`Pinecone API Error: ${err}`);
        }

        console.log(`[PINECONE] ${idArray.length} records deleted successfully!`);
        return true;
    } catch (error) {
        console.error("[PINECONE ERROR] Delete failed:", error.message);
        return false;
    }
};

module.exports = {
    uploadToPinecone,
    searchPinecone,
    deleteFromPinecone,
    getIndexHost
};