const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');

router.get('/', itemController.getItems);
router.get('/search', itemController.searchItems);
router.get('/suggestions', itemController.getSuggestions);
router.post('/save', itemController.saveItem);
router.delete('/:id', itemController.deleteItem);

module.exports = router;
