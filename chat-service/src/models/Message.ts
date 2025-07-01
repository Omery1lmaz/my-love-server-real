import mongoose, { Document, Schema, Types } from "mongoose";
import { deflate } from "zlib";

export interface IMessage extends Document {
    chatId: Types.ObjectId;
    sender: string;
    text: string;
    createdAt: Date;
    readBy: string[];
}

const messageSchema = new Schema<IMessage>({
    chatId: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
    sender: { type: String, required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    readBy: [{ type: String }]
});

export const Message = mongoose.model<IMessage>("Message", messageSchema); 