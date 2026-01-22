import { Socket } from "socket.io";
import { registerChatHandlers } from "./chatHandler.js";

// 🔌 Main socket connection handler
export const handleSocketConnection = (socket: Socket) => {
  console.log("🟢 Client connected:", socket.id, "| User:", socket.data.userId);

  // 📝 Register all feature handlers
  registerChatHandlers(socket);
  // 🚀 Add more handlers here in the future:
  // registerVideoCallHandlers(socket);
  // registerGameHandlers(socket);

  // 🔴 Handle disconnect
  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
};
