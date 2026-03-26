const path = require('path');

module.exports = {
    PORT: process.env.PORT || 3000,
    DATA_FILE: path.join(__dirname, '../../data.json'),
    PUBLIC_DIR: path.join(__dirname, '../../public'),
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/knowledge-base'
};
