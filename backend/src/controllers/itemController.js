const itemService = require('../services/itemService');


const getItems = async (req, res) => {
    const items = await itemService.getAllItems(req.auth.userId);
    res.json(items);
};

const saveItem = async (req, res) => {
    const { url, title,selectedText, imageUrl, sourceType } = req.body;

    if (!url || !title || (!selectedText && !imageUrl && !['youtube', 'pdf'].includes(sourceType))) {
        return res.status(400).json({
            error: 'Missing required fields. Provide url, title, and at least text or imageUrl.'
        });
    }

    const newItem = await itemService.saveItem({ ...req.body, userId: req.auth.userId });

    res.status(201).json({
        message: 'Successfully saved!',
        newItem
    });
};

const deleteItem = async (req, res) => {
    const success = await itemService.deleteItem(req.params.id, req.auth.userId);

    if (!success) {
        return res.status(404).json({ error: 'Item not found' });
    }

    console.log(`[DELETED] id=${req.params.id} userId=${req.auth.userId}`);
    res.json({ message: 'Item deleted successfully' });
};

const searchItems = async (req, res) => {
    const { q } = req.query;
    if (!q) {
        return res.json([]);
    }
    try {
        const results = await itemService.searchItems(q, req.auth.userId);
        res.json(results);
    } catch (err) {
        console.error('Search error:', err);
        res.status(500).json({ error: 'Failed to perform search' });
    }
};

const getSuggestions = async (req, res) => {
    const { q } = req.query;
    if (!q) {
        return res.json([]);
    }
    const suggestions = await itemService.getSuggestions(q, req.auth.userId);
    res.json(suggestions);
};

module.exports = {
    getItems,
    saveItem,
    deleteItem,
    searchItems,
    getSuggestions
};
