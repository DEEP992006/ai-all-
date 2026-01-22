import { io, Socket } from "socket.io-client"

// 🔌 Socket instance
let socket: Socket | null = null

// 🏭 Socket factory function
export const getSocket = (token?: string): Socket => {
  if (!socket) {
    socket = io("http://localhost:8080", {
      autoConnect: false, // 🔥 IMPORTANT: Manual control
      auth: {
        token,
      },
    })
  }

  return socket
}
