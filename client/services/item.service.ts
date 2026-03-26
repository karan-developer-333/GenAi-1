import api from "@/lib/api"

export const fetchItems = async () => {
    const res = await api.get("/api/items")
    return res.data
}

export const removeItem = async (id: string) => {
    const res = await api.delete(`/api/items/${id}`)
    return res.data
}

export const searchItems = async (query: string) => {
    const res = await api.get(`/api/items/search?q=${query}`)
    return res.data
}