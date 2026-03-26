import { fetchItems, removeItem, searchItems } from "@/services/item.service"

export const useItems = () => {
 

    const getItems = async () => {
        const res = await fetchItems()
        return res
    }
    

    const deleteItem = async (id: string) => {
        const res = await removeItem(id)
        return res
    }

    const queryItems = async (query: string) => {
        const res = await searchItems(query)
        return res
    }

    return {getItems, deleteItem, queryItems}

}