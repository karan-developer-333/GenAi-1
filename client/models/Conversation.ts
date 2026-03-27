import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  tool_calls?: any[]; // For assistant messages
  tool_call_id?: string; // For tool messages
  name?: string; // Optional: name of the tool
  timestamp?: Date;
}

export interface IConversation extends Document {
  userId: string;
  title: string;
  messages: IMessage[];
  lastUpdated: Date;
}

const messageSchema = new Schema<IMessage>({
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true,
  },
  content: { type: String, default: '' },
  tool_calls: { type: Schema.Types.Mixed },
  tool_call_id: { type: String },
  name: { type: String },
  timestamp: { type: Date, default: Date.now },
});

const conversationSchema = new Schema<IConversation>({
  userId: { type: String, required: true, index: true },
  title: { type: String, default: 'New Conversation' },
  messages: [messageSchema],
  lastUpdated: { type: Date, default: Date.now },
});

conversationSchema.pre('save', function () {
  this.lastUpdated = new Date();
});

export default mongoose.models.Conversation ||
  mongoose.model<IConversation>('Conversation', conversationSchema);