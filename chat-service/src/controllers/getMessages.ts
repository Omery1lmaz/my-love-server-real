import { Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import { Message } from "../models/Message";
export const getMessages = async (req: AuthRequest, res: Response) => {
    const { userId } = req.query;
    if (!userId) {
        return res.status(400).json({ message: "userId is required" });
    }
    const messages = await Message.find({
        $or: [
            { sender: req.userId, receiver: userId },
            { sender: userId, receiver: req.userId },
        ],
    }).sort({ createdAt: 1 });
    res.status(200).json({ data: messages });
}; 