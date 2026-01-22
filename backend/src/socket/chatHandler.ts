import { Socket } from "socket.io";

// 💬 Chat handlers registration
export const registerChatHandlers = (socket: Socket) => {
  // 🚪 Join room
  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log(`${socket.id} joined ${roomId}`);
  });

  // 📤 Send message to room
  socket.on("send-message", ({ roomId, message }) => {
    socket.to(roomId).emit("receive-message", {
      message,
      sender: socket.data.userId,
    });
  });
};
