import { NextRequest, NextResponse } from 'next/server';
import { getAuthUserId, unauthorizedResponse } from '@/lib/auth';
import Item from '@/lib/models/Item';
import dbConnect from '@/lib/database';

export async function GET(req: NextRequest) {
  const userId = await getAuthUserId(req);
  if (!userId) return unauthorizedResponse();

  try {
    await dbConnect();
    // Get latest 30 items for the specific user to extract tags from
    const items = await Item.find({ userId }).sort({ timestamp: -1 }).limit(30);
    const tagsSet = new Set<string>();
    
    items.forEach(item => {
      if (item.tags && typeof item.tags === 'string') {
        const splittedTags = item.tags.split(" ");
        splittedTags.forEach(tag => {
          if (tag.trim()) tagsSet.add(tag.trim());
        });
      }
    });

    const tags = Array.from(tagsSet).slice(0, 20); // Limit to top 20 latest unique tags
    return NextResponse.json({ success: true, tags });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
