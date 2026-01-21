import express from "express";
import { Socket, Server as SocketIOServer } from "socket.io";
import { createServer } from "http";

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
interface messa{
    msg:string
}

// 🔌 Handle Socket.IO connections
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
  socket.emit("join", { message: "Connectvggggggggged to Socket.IO server" });

  socket.on("join",async (data:messa) => {
    console.log(data);
  })
});

// 🚀 Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Socket.IO server ready at http://localhost:${PORT}`);
});