import dbConnect from '../lib/database';
import Item from '../models/Item';
import { getIndexHost, uploadToPinecone, deleteFromPinecone } from '../services/server/PineconeService';
import { Pinecone } from '@pinecone-database/pinecone';

const pc = new Pinecone({
  apiKey: process.env.PINECONE_KEY || process.env.PINECONE_API_KEY!
});

async function reembedAllData() {
  await dbConnect();
  
  const allItems = await Item.find({});
  console.log(`Found ${allItems.length} items to re-embed`);
  
  if (allItems.length === 0) {
    console.log('No items to re-embed');
    return;
  }

  const indexName = process.env.PINECONE_INDEX_NAME || 'auto-index';
  
  try {
    await pc.deleteIndex(indexName);
    console.log(`Deleted index: ${indexName}`);
    
    await new Promise(resolve => setTimeout(resolve, 30000));
    
    await pc.createIndex({
      name: indexName,
      dimension: 1024,
      metric: 'cosine',
      spec: {
        serverless: {
          cloud: 'aws',
          region: 'us-east-1'
        }
      }
    });
    console.log(`Created new index: ${indexName} with 1024 dimensions`);
    
    await new Promise(resolve => setTimeout(resolve, 60000));
    
  } catch (error: any) {
    console.log('Index recreation skipped (may already exist):', error.message);
  }
  
  for (const item of allItems) {
    try {
      await uploadToPinecone({
        userId: item.userId.toString(),
        title: item.title,
        text: item.text,
        imageUrl: item.imageUrl,
        imageAlt: item.imageAlt,
        url: item.url,
        type: item.type,
        sourceType: item.sourceType,
        tags: item.tags,
        id: item._id.toString()
      });
      console.log(`Re-embedded: ${item.title}`);
    } catch (error: any) {
      console.error(`Failed to re-embed ${item.title}:`, error.message);
    }
  }
  
  console.log('Re-embedding complete!');
}

reembedAllData().catch(console.error);
