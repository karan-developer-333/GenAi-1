const express = require('express');
const router = express.Router();
const itemRoutes = require('./itemRoutes.route');
const graphRoutes = require('./graphRoutes.route');
const aiSuggestionsRoutes = require('./aiSuggestions.route');
const agentRoutes = require('./agentRoutes.route');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.use('/items', itemRoutes);
router.use('/graph-search', graphRoutes);
router.use("/ai-suggestions",aiSuggestionsRoutes);
router.use('/agent', agentRoutes);

module.exports = router;
