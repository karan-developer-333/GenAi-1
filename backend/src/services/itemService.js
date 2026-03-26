const pinecone = require('../config/pinecone');
const Item = require('../models/itemModel');
const { generateTags } = require('./aiService');



const getAllItems = async (userId) => {
    const items = await Item.find({ userId }).sort({ timestamp: -1 });
    return items;
};

const saveItem = async (itemData) => {
    const { userId, title,  selectedText, imageUrl, imageAlt, url, sourceType, note } = itemData;

    const finalText = selectedText || null;

    // Determine media type (text / image / mixed)
    let type = 'text';
    if (imageUrl && finalText) type = 'mixed';
    else if (imageUrl) type = 'image';

    const tags = note || await generateTags({title,selectedText,imageUrl,imageAlt,url,sourceType});

    const newItem = new Item({
        userId,
        type,
        sourceType: sourceType || 'article',
        url,
        title,
        text: finalText,
        tags: tags || "",
        imageUrl: imageUrl || null,
        imageAlt: imageAlt || null
    });

    await newItem.save();

    // Asynchronously upload to Pinecone for semantic search
    pinecone.uploadToPinecone({
        userId,
        title,
        text: newItem.text,
        imageUrl,
        imageAlt,
        url,
        type: newItem.type,
        sourceType: newItem.sourceType,
        tags: newItem.tags,
        id: newItem._id.toString()
    }).catch(err => {
        console.error("[PINECONE SYNC ERROR]", err.message);
    });

    return newItem;
};

const deleteItem = async (id, userId) => {
    const item = await Item.findOneAndDelete({ _id: id, userId });

    if (!item) return false;

    // Also delete from Pinecone
    pinecone.deleteFromPinecone(id.toString()).catch(err => {
        console.error("[PINECONE DELETE ERROR]", err.message);
    });

    return true;
};

const searchItems = async (query, userId) => {
    const searchResults = await pinecone.searchPinecone({ query, userId });

    if (!searchResults || !searchResults.result || !searchResults.result.hits) {
        console.log("[SEARCH] No results found in Pinecone.");
        return [];
    }

    const hits = searchResults.result.hits;
    
    const mongoose = require('mongoose');
    const ids = hits
        .map(hit => hit.id)
        .filter(id => mongoose.Types.ObjectId.isValid(id));

    if (ids.length === 0) return [];

    // Fetch full data from MongoDB and ensure it belongs to the user
    const items = await Item.find({ _id: { $in: ids }, userId });

    const itemsMap = items.reduce((map, item) => {
        map[item._id.toString()] = item;
        return map;
    }, {});

    return hits
        .map(hit => {
            const mongoItem = itemsMap[hit.id];
            if (!mongoItem) return null;
            return {
                id: mongoItem._id,
                score: hit.score,
                ...mongoItem.toObject(),
                selectedText: mongoItem.text
            };
        })
        .filter(i => i !== null);
};

const getSuggestions = async (query, userId) => {
    const q = query.toLowerCase();

    const items = await Item.find({
        userId,
        title: { $regex: q, $options: 'i' }
    })
        .select('title')
        .limit(20);

    const suggestions = [...new Set(items.map(i => i.title))].slice(0, 5);

    return suggestions;
};

module.exports = {
    getAllItems,
    saveItem,
    deleteItem,
    searchItems,
    getSuggestions
};
