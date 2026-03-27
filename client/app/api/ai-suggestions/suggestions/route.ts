import { NextRequest, NextResponse } from 'next/server';
import { getAuthUserId, unauthorizedResponse } from '@/lib/auth';
import { getRelatedTags } from '@/services/server/AIService';

export async function POST(req: NextRequest) {
  const userId = await getAuthUserId(req);
  if (!userId) return unauthorizedResponse();

  try {
    const { tags } = await req.json();
    
    // Limit input tags to AI to avoid too many suggestions
    const limitedTags = Array.isArray(tags) ? tags.slice(0, 10) : [];
    
    const generatedTags = await getRelatedTags(limitedTags);

    const formatedTags = generatedTags.replace("\n"," ").split(" ").filter((tag: string) => tag.trim() !== "");

    // Final limit on generated tags
    const finalTags = formatedTags.slice(0, 15);

    return NextResponse.json({ success: true, generatedTags: finalTags });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
