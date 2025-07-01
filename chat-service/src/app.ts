import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import dotenv from "dotenv";
import connectDB from "./db";
import chatRoutes from "./routes/chat";
import { socketHandler } from "./socket";
import { verifySocketJWT } from "./middlewares/auth";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

app.use(cors());
app.use(express.json());
app.use(chatRoutes);

connectDB();

io.use(verifySocketJWT);
io.on("connection", (socket) => socketHandler(socket, io));

const PORT = 4200;
server.listen(PORT, () => {
    console.log(`Chat Service listening on port ${PORT}`);
}); 