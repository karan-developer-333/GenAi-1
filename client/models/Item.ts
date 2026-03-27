import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IItem extends Document {
  userId: string;
  type: string;
  sourceType: string;
  url: string;
  title: string;
  text: string | null;
  tags: string | null;
  imageUrl: string | null;
  imageAlt: string | null;
  timestamp: Date;
}

const itemSchema = new Schema<IItem>({
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

const Item: Model<IItem> = mongoose.models.Item || mongoose.model<IItem>('Item', itemSchema);

export default Item;
