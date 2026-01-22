import { create } from "zustand"
import { Socket } from "socket.io-client"
import { getSocket } from "@/lib/socket"

// 📦 Socket state interface
interface SocketState {
  socket: Socket | null
  isConnected: boolean
  connect: (token: string) => void
  disconnect: () => void
}

// 🗄️ Socket store with Zustand
export const useSocketStore = create<SocketState>((set) => ({
  socket: null,
  isConnected: false,

  // 🔌 Connect to Socket.IO server
  connect: (token) => {
    const socket = getSocket(token)

    socket.auth = { token } // 🔐 Attach JWT
    socket.connect()

    // 🟢 Handle connection
    socket.on("connect", () => {
      console.log("🟢 socket connected")
      set({ socket, isConnected: true })
    })

    // 🔴 Handle disconnection
    socket.on("disconnect", () => {
      console.log("🔴 socket disconnected")
      set({ isConnected: false })
    })
  },

  // 🔌 Disconnect from server
  disconnect: () => {
    set((state) => {
      state.socket?.disconnect()
      return { socket: null, isConnected: false }
    })
  },
}))
