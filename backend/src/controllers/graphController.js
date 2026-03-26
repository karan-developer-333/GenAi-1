/**
 * Graph Controller
 * Handles POST /api/graph-search requests.
 */

const graphService = require('../services/graphService');

const search = async (req, res, next) => {
    try {
        const { query } = req.body;

        if (!query || typeof query !== 'string' || query.trim().length === 0) {
            return res.status(400).json({ error: 'A non-empty "query" string is required.' });
        }

        const graph = await graphService.searchAndBuildGraph(query.trim(), req.auth.userId);
        return res.json(graph);
    } catch (err) {
        console.error('[GRAPH SEARCH ERROR]', err.message);
        next(err);
    }
};

module.exports = { search };
