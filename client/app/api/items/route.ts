// ✅ 1. Node runtime force karo
export const runtime = "nodejs";

// ✅ 2. transformers env config (TOP pe)
import { env } from "@xenova/transformers";

env.backends.onnx.wasm.numThreads = 1;
env.backends.onnx.useGPU = false;

import { NextRequest, NextResponse } from 'next/server';
import { getAuthUserId, unauthorizedResponse } from '@/lib/auth';
import { getAllItems, saveItem } from '@/services/server/ItemService';

export async function GET(req: NextRequest) {
  const userId = await getAuthUserId(req);
  if (!userId) return unauthorizedResponse();

  try {
    const items = await getAllItems(userId);
    return NextResponse.json({ items });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const userId = await getAuthUserId(req);
  if (!userId) return unauthorizedResponse();

  try {
    const body = await req.json();
    const item = await saveItem({ ...body, userId });
    return NextResponse.json(item);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}