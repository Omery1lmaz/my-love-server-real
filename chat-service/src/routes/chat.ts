import { Router } from "express";
import { verifyJWT } from "../middlewares/auth";
import { Chat } from "../models/Chat";
import { Message } from "../models/Message";
const router = Router();

router.get("/conversations", verifyJWT, async (req, res) => {
    const userId = (req as any).userId;
    const chats = await Chat.find({ participants: userId }).sort({ "lastMessage.createdAt": -1 });
    res.json(chats);
});

router.get("/messages/:chatId", verifyJWT, async (req, res) => {
    const { chatId } = req.params;
    const messages = await Message.find({ chatId }).sort({ createdAt: 1 });
    res.json(messages);
});

router.post("/send", verifyJWT, async (req, res) => {
    const userId = (req as any).userId;
    const { chatId, text } = req.body;
    if (!chatId || !text) return res.status(400).json({ message: "chatId and text required" });
    const message = await Message.create({ chatId, sender: userId, text, readBy: [userId] });
    await Chat.findByIdAndUpdate(chatId, {
        lastMessage: { text, sender: userId, createdAt: message.createdAt }
    });
    res.status(201).json(message);
});

export default router; 