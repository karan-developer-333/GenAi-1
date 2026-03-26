
import { getAllTags } from "@/services/aiSuggestion.service";
import {  NextResponse } from "next/server"

export const GET = async () => {

    const tags = await getAllTags();
    
    return NextResponse.json({tags})
}