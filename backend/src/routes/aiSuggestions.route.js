const express = require("express");
const router = express.Router();
const aiSuggestionsController = require("../controllers/aiSuggestionsController");

router.get("/all-tags", aiSuggestionsController.getAllTags);
router.post("/suggestions", aiSuggestionsController.getSuggestions);

module.exports = router;
