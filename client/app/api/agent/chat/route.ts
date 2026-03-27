import { NextRequest, NextResponse } from 'next/server';
import { getAuthUserId, unauthorizedResponse } from '@/lib/auth';
import { chat } from '@/services/server/AgentService';

export async function POST(req: NextRequest) {
  const userId = await getAuthUserId(req);
  if (!userId) return unauthorizedResponse();

  try {
    const { query, conversationId } = await req.json();
    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const result = await chat(query, userId, conversationId);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
