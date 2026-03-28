import { NextRequest, NextResponse } from 'next/server';
import { getAuthUserId, unauthorizedResponse } from '@/lib/auth';
import { getAllItems } from '@/services/server/ItemService';

export async function GET(req: NextRequest) {
  const userId = await getAuthUserId(req);
  if (!userId) return unauthorizedResponse();

  try {
    const items = await getAllItems(userId);
    
    const formattedItems = items.map(item => ({
      _id: item._id,
      type: item.type,
      sourceType: item.sourceType,
      url: item.url,
      title: item.title,
      text: item.text,
      tags: item.tags,
      imageUrl: item.imageUrl,
      imageAlt: item.imageAlt,
      timestamp: item.timestamp,
    }));

    return NextResponse.json({ items: formattedItems });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
