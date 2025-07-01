import mongoose, { Document, Schema } from "mongoose";

export interface IChat extends Document {
  participants: string[];
  lastMessage: {
    text: string;
    sender: string;
    createdAt: Date;
  };
}

const chatSchema = new Schema<IChat>({
  participants: [{ type: String, required: true }],
  lastMessage: {
    text: { type: String },
    sender: { type: String },
    createdAt: { type: Date }
  }
});

export const Chat = mongoose.model<IChat>("Chat", chatSchema); 