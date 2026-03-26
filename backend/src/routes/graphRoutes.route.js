const express = require('express');
const router = express.Router();
const graphController = require('../controllers/graphController');

router.post('/', graphController.search);

module.exports = router;
