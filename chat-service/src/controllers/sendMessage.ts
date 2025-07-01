import { Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import { Message } from "../models/Message";
export const sendMessage = async (req: AuthRequest, res: Response) => {
    const { receiver, content } = req.body;
    if (!receiver || !content) {
        return res.status(400).json({ message: "Receiver and content are required" });
    }
    const message = new Message({
        sender: req.userId,
        receiver,
        content,
    });
    await message.save();
    res.status(201).json({ message: "Message sent", data: message });
}; 