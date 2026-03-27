import api from "@/lib/api"

export const getAllTags = async () => {

    try {
        const res = await api.get('/ai-suggestions/all-tags')
        return res.data.tags.map((tag:string)=>tag.replaceAll("\n"," ").trim()).join(",").split(",")
    } catch (error:any) {
        return {success:false,message:"Failed to fetch tags : " + error.message}
    }

}

export const getSuggestions = async (tags: string[]) => {

    try {
        const res = await api.post('/ai-suggestions/suggestions', { tags })
        return res.data.generatedTags
    } catch (error) {
        return []
    }

}