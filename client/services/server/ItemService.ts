import dbConnect from '../../lib/database';
import Item from '../../models/Item';
import { uploadToPinecone, searchPinecone, deleteFromPinecone } from './PineconeService';
import { generateTags } from './AIService';
import mongoose from 'mongoose';

export const getAllItems = async (userId: string) => {
  await dbConnect();
  const items = await Item.find({ userId }).sort({ timestamp: -1 });
  return items;
};

export const saveItem = async (itemData: {
  userId: string;
  title: string;
  selectedText?: string;
  imageUrl?: string;
  imageAlt?: string;
  url: string;
  sourceType?: string;
  note?: string;
}) => {
  await dbConnect();
  const { userId, title, selectedText, imageUrl, imageAlt, url, sourceType, note } = itemData;

  const finalText = selectedText || null;

  // Determine media type (text / image / mixed)
  let type = 'text';
  if (imageUrl && finalText) type = 'mixed';
  else if (imageUrl) type = 'image';

  const tags = note || await generateTags({ title, selectedText, imageUrl, imageAlt, url, sourceType });

  const newItem = new Item({
    userId,
    type,
    sourceType: sourceType || 'article',
    url,
    title,
    text: finalText,
    tags: tags || "",
    imageUrl: imageUrl || null,
    imageAlt: imageAlt || null
  });

  await newItem.save();

  // Asynchronously upload to Pinecone for semantic search
  uploadToPinecone({
    userId,
    title,
    text: newItem.text,
    imageUrl,
    imageAlt,
    url,
    type: newItem.type,
    sourceType: newItem.sourceType,
    tags: newItem.tags,
    id: newItem._id.toString()
  }).catch((err: any) => {
    console.error("[PINECONE SYNC ERROR]", err.message);
  });

  return newItem;
};

export const deleteItem = async (id: string, userId: string) => {
  await dbConnect();
  const item = await Item.findOneAndDelete({ _id: id, userId });

  if (!item) return false;

  // Also delete from Pinecone
  deleteFromPinecone(id.toString()).catch((err: any) => {
    console.error("[PINECONE DELETE ERROR]", err.message);
  });

  return true;
};

export const searchItems = async (query: string, userId: string) => {
  await dbConnect();
  const searchResults = await searchPinecone({ query, userId });

  if (!searchResults || !searchResults.result || !searchResults.result.hits) {
    console.log("[SEARCH] No results found in Pinecone.");
    return [];
  }

  const hits = searchResults.result.hits;
  
  const ids = hits
    .map((hit: any) => hit.id)
    .filter((id: string) => mongoose.Types.ObjectId.isValid(id));

  if (ids.length === 0) return [];

  // Fetch full data from MongoDB and ensure it belongs to the user
  const items = await Item.find({ _id: { $in: ids }, userId });

  const itemsMap = items.reduce((map: any, item) => {
    map[item._id.toString()] = item;
    return map;
  }, {});

  return hits
    .map((hit: any) => {
      const mongoItem = itemsMap[hit.id];
      if (!mongoItem) return null;
      return {
        id: mongoItem._id,
        score: hit.score,
        ...mongoItem.toObject(),
        selectedText: mongoItem.text
      };
    })
    .filter((i: any) => i !== null);
};

export const getSuggestions = async (query: string, userId: string) => {
  await dbConnect();
  const q = query.toLowerCase();

  const items = await Item.find({
    userId,
    title: { $regex: q, $options: 'i' }
  })
    .select('title')
    .limit(20);

  const suggestions = [...new Set(items.map(i => i.title))].slice(0, 5);

  return suggestions;
};
