import { getIndexHost } from './PineconeService';
import { toGraph } from './GraphTransformer';
import { getEmbeddings } from '@/lib/embeddings';

/**
 * Run a semantic search against Pinecone with topK=10
 * and return D3-formatted graph data.
 */
export async function searchAndBuildGraph(query: string, userId: string) {
  const embedding = await getEmbeddings(query);
  const host = await getIndexHost();

  const response = await fetch(`https://${host}/query`, {
    method: 'POST',
    headers: {
      'Api-Key': (process.env.PINECONE_KEY || process.env.PINECONE_API_KEY) as string,
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
