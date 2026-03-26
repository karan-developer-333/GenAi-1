require('dotenv').config();
const app = require('./src/app');
const config = require('./src/config');
const connectDB = require('./src/config/database');

connectDB();

app.listen(config.PORT, () => {
    console.log(`Knowledge Backend running on http://localhost:${config.PORT}`);
    console.log(`Dashboard: http://localhost:${config.PORT}`);
});
