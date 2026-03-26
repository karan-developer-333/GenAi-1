const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    userId: { type: String, required: true, index: true },
    type: { type: String, enum: ['text', 'image', 'mixed'], default: 'text' },
    sourceType: { type: String, default: 'article' },
    url: { type: String, required: true },
    title: { type: String, required: true },
    text: { type: String, default: null },
    tags: { type: String, default: null },
    imageUrl: { type: String, default: null },
    imageAlt: { type: String, default: null },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Item', itemSchema);
