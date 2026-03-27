import api from "@/lib/api"

export const fetchItems = async () => {
    const res = await api.get("/items")
    return res.data
}

export const removeItem = async (id: string) => {
    const res = await api.delete(`/items/${id}`)
    return res.data
}

export const searchItems = async (query: string) => {
    const res = await api.get(`/items/search?q=${query}`)
    return res.data
}