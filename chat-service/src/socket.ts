import { Server, Socket } from "socket.io";
import { Chat } from "./models/Chat";
import { sendPushNotification } from "./utils/notify";
import { Message } from "./models/Message";

export const socketHandler = (socket: Socket, io: Server) => {
    const userId = (socket as any).userId;
    if (!userId) return socket.disconnect();

    socket.on("join", (chatId: string) => {
        socket.join(chatId);
    });

    socket.on("message", async ({ chatId, text }) => {
        if (!chatId || !text) return;
        const message = await Message.create({
            chatId,
            sender: userId,
            text,
            readBy: [userId]
        });
        await Chat.findByIdAndUpdate(chatId, {
            lastMessage: { text, sender: userId, createdAt: message.createdAt }
        });
        io.to(chatId).emit("message", message);

        // Partner offline notification (placeholder)
        const chat = await Chat.findById(chatId);
        if (chat) {
            const partnerId = chat.participants.find((id) => id !== userId);
            const clients = await io.in(chatId).allSockets();
            if (!clients.has(partnerId!)) {
                sendPushNotification(partnerId!, text);
            }
        }
    });

    socket.on("disconnect", () => {
        // Optionally handle user disconnect
    });
}; 