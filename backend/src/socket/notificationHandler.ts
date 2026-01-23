import { Socket } from "socket.io";

// 🔔 Notification handlers registration
export const registerNotificationHandlers = (socket: Socket) => {
  
  // 📣 User joined notification
  socket.on("notify-user-joined", ({ roomId, userName }) => {
    // 📢 Broadcast to all others in the room
    socket.to(roomId).emit("notification", {
      type: "join",
      message: `${userName} joined the room`,
      userName,
      userId: socket.data.userId,
      timestamp: new Date().toISOString(),
    });
    console.log(`🔔 User ${userName} joined ${roomId}`);
  });

  // 📣 User left notification  
  socket.on("notify-user-left", ({ roomId, userName }) => {
    // 📢 Broadcast to all others in the room
    socket.to(roomId).emit("notification", {
      type: "leave",
      message: `${userName} left the room`,
      userName,
      userId: socket.data.userId,
      timestamp: new Date().toISOString(),
    });
    console.log(`🔔 User ${userName} left ${roomId}`);
  });
};

// 🔔 Emit message notification to room
export const emitMessageNotification = (socket: Socket, roomId: string, userName: string, message: string) => {
  socket.to(roomId).emit("notification", {
    type: "message",
    message: `New message from ${userName}`,
    userName,
    userId: socket.data.userId,
    messageContent: message,
    timestamp: new Date().toISOString(),
  });
};
