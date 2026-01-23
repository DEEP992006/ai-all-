import { create } from "zustand"
import { persist } from "zustand/middleware"

// 💬 Chat room interface
interface ChatRoom {
  id: string
  name: string
  createdAt: string
  lastActivity: string
}

// 🏪 Chat store interface
interface ChatStore {
  // 📋 List of active chat rooms
  chatRooms: ChatRoom[]
  
  // 🎯 Currently active room ID
  activeRoomId: string | null
  
  // ➕ Add or join a chat room
  addChatRoom: (roomId: string, roomName?: string) => void
  
  // 🎯 Set active room
  setActiveRoom: (roomId: string) => void
  
  // 🗑️ Remove a chat room
  removeChatRoom: (roomId: string) => void
  
  // 🔍 Get room by ID
  getChatRoom: (roomId: string) => ChatRoom | undefined
  
  // 🔄 Update last activity
  updateLastActivity: (roomId: string) => void
  
  // 🧹 Clear all rooms
  clearAllRooms: () => void
}

// 🏪 Create persisted chat store
export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      chatRooms: [],
      activeRoomId: null,
      
      addChatRoom: (roomId, roomName) => {
        const exists = get().chatRooms.find((room) => room.id === roomId)
        if (!exists) {
          set((state) => ({
            chatRooms: [
              ...state.chatRooms,
              {
                id: roomId,
                name: roomName || `Room ${roomId}`,
                createdAt: new Date().toISOString(),
                lastActivity: new Date().toISOString(),
              },
            ],
          }))
        } else {
          // Update last activity if room exists
          get().updateLastActivity(roomId)
        }
      },
      
      setActiveRoom: (roomId) => {
        set({ activeRoomId: roomId })
        get().updateLastActivity(roomId)
      },
      
      removeChatRoom: (roomId) =>
        set((state) => ({
          chatRooms: state.chatRooms.filter((room) => room.id !== roomId),
          activeRoomId: state.activeRoomId === roomId ? null : state.activeRoomId,
        })),
      
      getChatRoom: (roomId) => {
        return get().chatRooms.find((room) => room.id === roomId)
      },
      
      updateLastActivity: (roomId) => {
        set((state) => ({
          chatRooms: state.chatRooms.map((room) =>
            room.id === roomId
              ? { ...room, lastActivity: new Date().toISOString() }
              : room
          ),
        }))
      },
      
      clearAllRooms: () => set({ chatRooms: [], activeRoomId: null }),
    }),
    {
      name: "chat-rooms-storage", // 💾 localStorage key
    }
  )
)
