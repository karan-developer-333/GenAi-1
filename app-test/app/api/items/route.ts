import { fetchItems } from "@/services/item.service"
import { NextResponse } from "next/server"

export const GET = async () => {

    const data = await fetchItems();

    return NextResponse.json(data)
}