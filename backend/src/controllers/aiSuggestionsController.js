const itemModel = require("../models/itemModel")
const aiService = require("../services/aiService")

const getAllTags = async (req, res) => {
    // Get latest 30 items for the specific user to extract tags from
    const items = await itemModel.find({ userId: req.auth.userId }).sort({ timestamp: -1 }).limit(30);
    const tagsSet = new Set();
    items.forEach(item => {
        if (item.tags && typeof item.tags === 'string') {
            const splittedTags = item.tags.split(" ");
            splittedTags.forEach(tag => {
                if (tag.trim()) tagsSet.add(tag.trim());
            });
        }
    });
    const tags = Array.from(tagsSet).slice(0, 20); // Limit to top 20 latest unique tags
    res.status(200).json({ success: true, tags });
}

const getSuggestions = async (req,res) => {
    const {tags} = req.body;
    
    // Limit input tags to AI to avoid too many suggestions
    const limitedTags = Array.isArray(tags) ? tags.slice(0, 10) : [];
    
    const generatedTags = await aiService.getRelatedTags(limitedTags);

    const formatedTags = generatedTags.replace("\n"," ").split(" ").filter(tag => tag.trim() !== "");

    // Final limit on generated tags
    const finalTags = formatedTags.slice(0, 15);

    res.status(200).json({ success: true, generatedTags: finalTags });
}

module.exports = {
    getAllTags,
    getSuggestions,
}