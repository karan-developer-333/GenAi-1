import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export async function getAuthUserId(req: NextRequest): Promise<string | null> {
  // 1. Check for x-user-id header (for extension/standalone access)
  const extensionUserId = req.headers.get('x-user-id');
  if (extensionUserId) {
    return extensionUserId;
  }

  // 2. Check for Clerk session
  const { userId } = await auth();
  return userId;
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
