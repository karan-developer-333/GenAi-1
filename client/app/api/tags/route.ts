import { NextRequest, NextResponse } from 'next/server';
import { getAuthUserId, unauthorizedResponse } from '@/lib/auth';
import { getTagsByUserId } from "@/services/server/AiSuggestionService";

export const GET = async (req: NextRequest) => {
    const userId = await getAuthUserId(req);
    if (!userId) return unauthorizedResponse();

    try {
        const tags = await getTagsByUserId(userId);
        return NextResponse.json({ tags });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}