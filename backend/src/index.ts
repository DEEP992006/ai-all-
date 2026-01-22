import express from "express";
import { Socket, Server as SocketIOServer } from "socket.io";
import { createServer } from "http";
import { verifyToken } from "@clerk/backend";
import dotenv from "dotenv";
import { handleSocketConnection } from "./socket/index.js";

dotenv.config();

// Initialize Express app and Socket.IO server
const app = express();
app.use(express.json())
const server = createServer(app)

// 🔌 Configure Socket.IO with CORS
const io = new SocketIOServer(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 8080;

app.use(express.json());

// 🏠 Health check endpoint
app.get("/", (req, res) => {
  res.json({ message: "Hello from backend" });
});

// 💬 Message interface
interface messa {
  msg: string
}

// 🔐 Socket authentication middleware
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token

    if (!token) {
      return next(new Error("Authentication error: No token provided"))
    }

    // 🔍 Verify Clerk token and extract user ID
    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    })

    // 📎 Attach user ID to socket
    socket.data.userId = payload.sub

    console.log("✅ User authenticated:", payload.sub)
    next()
  } catch (error) {
    console.error("❌ Authentication failed:", error)
    next(new Error("Authentication error"))
  }
})

// 🔌 Handle Socket.IO connections
io.on("connection", handleSocketConnection);

// 🚀 Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Socket.IO server ready at http://localhost:${PORT}`);
});