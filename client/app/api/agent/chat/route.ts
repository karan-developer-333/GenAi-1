// ✅ 1. Node runtime force karo
export const runtime = "nodejs";

// ✅ 2. transformers env config (TOP pe)
import { env } from "@xenova/transformers";

env.backends.onnx.wasm.numThreads = 1;
env.backends.onnx.useGPU = false;

import { NextRequest, NextResponse } from 'next/server';
import { getAuthUserId, unauthorizedResponse } from '@/lib/auth';
import { chatStream } from '@/services/server/AgentService';

export async function POST(req: NextRequest) {
  const userId = await getAuthUserId(req);
  if (!userId) return unauthorizedResponse();

  try {
    const { query, conversationId } = await req.json();
    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const yieldData = (obj: any) => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(obj)}\n\n`));
        };

        try {
          await chatStream(query, userId, conversationId, {
            onSources: (sources) => yieldData({ type: 'sources', data: sources }),
            onChunk: (text) => yieldData({ type: 'chunk', data: text }),
            onConversationId: (id) => yieldData({ type: 'conversationId', data: id }),
          });
          controller.close();
        } catch (err: any) {
          yieldData({ type: 'error', error: err.message });
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
