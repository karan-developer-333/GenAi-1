const agentService = require('../services/agentService');

const chat = async (req, res, next) => {
    try {
        const { query } = req.body;
        const userId = req.auth.userId;

        if (!query || typeof query !== 'string' || query.trim().length === 0) {
            return res.status(400).json({ error: 'A non-empty "query" string is required.' });
        }

        console.log(`[AGENT CONTROLLER] Handling chat for query: "${query}"`);
        const result = await agentService.chat(query.trim(), userId);
        
        return res.json(result);
    } catch (err) {
        console.error('[AGENT ERROR]', err.message);
        res.status(500).json({ error: 'Agent processing failed. Please try again.' });
    }
};

module.exports = { chat };
