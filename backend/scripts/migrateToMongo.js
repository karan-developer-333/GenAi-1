require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const config = require('./src/config');
const Item = require('./src/models/Item');
const pinecone = require('./src/config/pinecone');

async function migrate() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(config.MONGODB_URI);
        console.log("Connected.");

        const dataPath = config.DATA_FILE;
        if (!fs.existsSync(dataPath)) {
            console.log("No data.json found. Nothing to migrate.");
            process.exit(0);
        }

        const rawData = fs.readFileSync(dataPath, 'utf8');
        const items = JSON.parse(rawData);
        console.log(`Found ${items.length} items in data.json.`);

        for (const item of items) {
            // Check if already exists (by URL and title maybe)
            const existing = await Item.findOne({ url: item.url, title: item.title });
            if (existing) {
                console.log(`Skipping existing: ${item.title}`);
                continue;
            }

            const newItem = new Item({
                type: item.type,
                sourceType: item.sourceType,
                url: item.url,
                title: item.title,
                text: item.text,
                note: item.note,
                imageUrl: item.imageUrl,
                imageAlt: item.imageAlt,
                timestamp: item.timestamp
            });

            await newItem.save();
            console.log(`Migrated: ${item.title}`);

            // Sync with Pinecone using the new MongoDB ID
            try {
                await pinecone.uploadToPinecone({
                    ...newItem.toObject(),
                    id: newItem._id.toString()
                });
                console.log(`  Synced with Pinecone: ${newItem._id}`);
            } catch (pErr) {
                console.error(`  Pinecone sync failed for ${item.title}:`, pErr.message);
            }
        }

        console.log("Migration complete.");
        // Rename data.json to backup
        fs.renameSync(dataPath, dataPath + '.backup');
        console.log(`Renamed data.json to ${path.basename(dataPath)}.backup`);

        process.exit(0);
    } catch (err) {
        console.error("Migration Error:", err);
        process.exit(1);
    }
}

migrate();
