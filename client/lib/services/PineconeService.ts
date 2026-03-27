import { Pinecone } from "@pinecone-database/pinecone";
// @ts-ignore
import { pipeline } from '@xenova/transformers';

let embedder: any;

async function getEmbedding(text: string) {
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

let cachedHost: string | null = null;

const pc = new Pinecone({
  apiKey: (process.env.PINECONE_KEY || process.env.PINECONE_API_KEY) as string
});

const indexName = process.env.PINECONE_INDEX_NAME || "auto-index";

export async function getIndexHost() {
  if (cachedHost) return cachedHost;
  const desc = await pc.describeIndex(indexName);
  cachedHost = desc.host;
  return cachedHost;
}

const prepareRecord = (data: any) => {
  const record = { ...data };
  const id = record.id || record._id || record.mongoId;
  if (id) {
    record.id = id.toString();
  }

  for (const [key, value] of Object.entries(record)) {
    if (value === null || (typeof value === 'object' && key !== 'metadata')) {
      if (key !== 'id') delete record[key];
    }
  }
  return record;
};

export const uploadToPinecone = async (data: any) => {
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
        values: values as number[],
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
          "Api-Key": (process.env.PINECONE_KEY || process.env.PINECONE_API_KEY) as string,
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
  } catch (error: any) {
    console.error("[PINECONE ERROR] Upload failed:", error.message);
  }
};

export const searchPinecone = async (queryObject: { query: string; userId: string }) => {
  try {
    const { query, userId } = queryObject;
    const embedding = await getEmbedding(query);
    const host = await getIndexHost();

    const response = await fetch(`https://${host}/query`, {
      method: "POST",
      headers: {
        "Api-Key": (process.env.PINECONE_KEY || process.env.PINECONE_API_KEY) as string,
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
        hits: (data.matches || []).map((match: any) => ({
          id: match.id,
          score: match.score,
          fields: match.metadata
        }))
      }
    };

    console.log("[PINECONE] Data searched successfully!", transformedResult);
    return transformedResult;
  } catch (error: any) {
    console.error("[PINECONE ERROR] Search failed:", error.message);
    return null;
  }
};

export const deleteFromPinecone = async (ids: string | string[]) => {
  try {
    const idArray = Array.isArray(ids) ? ids : [ids];
    const host = await getIndexHost();

    console.log(`[PINECONE] Deleting records: ${idArray.join(', ')}`);

    const response = await fetch(`https://${host}/vectors/delete`, {
      method: "POST",
      headers: {
        "Api-Key": (process.env.PINECONE_KEY || process.env.PINECONE_API_KEY) as string,
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
  } catch (error: any) {
    console.error("[PINECONE ERROR] Delete failed:", error.message);
    return false;
  }
};
