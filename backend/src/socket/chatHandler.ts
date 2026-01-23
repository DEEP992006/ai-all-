import { Socket } from "socket.io";
import { ChatTable, db, usersTable } from "../db/index.js";
import { emitMessageNotification } from "./notificationHandler.js";

// 💬 Chat handlers registration
export const registerChatHandlers = (socket: Socket) => {
  // 🚪 Join room
  socket.on("join-room", async ({ roomId, userName }) => {
    socket.join(roomId);
    console.log(`${socket.id} joined ${roomId}`);
    
    // 🔔 Notify others that user joined
    socket.to(roomId).emit("notification", {
      type: "join",
      message: `${userName} joined the room`,
      userName,
      userId: socket.data.userId,
      timestamp: new Date().toISOString(),
    });
  });

  // 📤 Send message to room
  socket.on("send-message", async({ roomId, message, userName }) => {
    socket.to(roomId).emit("receive-message", {
      message,
      sender: socket.data.userId,
    });
    
    // 🔔 Emit message notification
    emitMessageNotification(socket, roomId, userName || "Someone", message);
    
    await db.insert(ChatTable).values({roomid:roomId,message:message,userId:socket.data.userId})
  });
  
  // 🚪 Leave room
  socket.on("leave-room", ({ roomId, userName }) => {
    // 🔔 Notify others that user left
    socket.to(roomId).emit("notification", {
      type: "leave",
      message: `${userName} left the room`,
      userName,
      userId: socket.data.userId,
      timestamp: new Date().toISOString(),
    });
    
    socket.leave(roomId);
    console.log(`${socket.id} left ${roomId}`);
  });
};
