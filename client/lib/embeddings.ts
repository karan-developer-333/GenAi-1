export type EmbeddingProvider = "openai" | "mistral";

const MISTRAL_ENDPOINT = "https://api.mistral.ai/v1/embeddings";
const MISTRAL_MODEL = "mistral-embed";
const OPENAI_ENDPOINT = "https://api.openai.com/v1/embeddings";
const OPENAI_MODEL = "text-embedding-ada-002";

let cachedEmbeddingFn: ((text: string) => Promise<number[]>) | null = null;

export interface EmbeddingOptions {
  provider?: EmbeddingProvider;
}

async function mistralEmbedding(text: string, apiKey: string): Promise<number[]> {
  const response = await fetch(MISTRAL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: MISTRAL_MODEL,
      input: text,
    })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Mistral API error: ${err}`);
  }

  const data = await response.json();
  return data.data[0].embedding;
}

async function openaiEmbedding(text: string, apiKey: string): Promise<number[]> {
  const response = await fetch(OPENAI_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      input: text,
    })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenAI API error: ${err}`);
  }

  const data = await response.json();
  return data.data[0].embedding;
}

function getProvider(): EmbeddingProvider {
  return (process.env.EMBEDDING_PROVIDER as EmbeddingProvider) || "mistral";
}

export async function getEmbeddings(text: string): Promise<number[]> {
  if (!cachedEmbeddingFn) {
    const provider = getProvider();
    
    if (provider === "openai") {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) throw new Error("OPENAI_API_KEY is not set");
      cachedEmbeddingFn = (text: string) => openaiEmbedding(text, apiKey);
    } else {
      const apiKey = process.env.MISTRAL_API_KEY;
      if (!apiKey) throw new Error("MISTRAL_API_KEY is not set");
      cachedEmbeddingFn = (text: string) => mistralEmbedding(text, apiKey);
    }
  }

  return await cachedEmbeddingFn(text);
}

export function clearEmbeddingsCache(): void {
  cachedEmbeddingFn = null;
}
