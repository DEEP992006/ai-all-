"use client"

import { useChatStore } from "@/store/chatStore"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"

// 💬 Create/Join Chat Page
export default function ChatPage() {
  const router = useRouter()
  const { addChatRoom, chatRooms, removeChatRoom } = useChatStore()
  const [isCreating, setIsCreating] = useState(false)
  
  // 📝 Form for creating/joining chat
  const { register, handleSubmit, reset } = useForm<{ roomId: string; roomName: string }>()

  // 🚀 Handle create/join room
  const onSubmit = (data: { roomId: string; roomName: string }) => {
    if (!data.roomId.trim()) return
    
    // ➕ Add room to store
    addChatRoom(data.roomId.trim(), data.roomName.trim() || undefined)
    
    // 🔀 Navigate to chat room
    router.push(`/chat/${data.roomId.trim()}`)
    
    reset()
  }

  // 🗑️ Delete a room
  const handleDeleteRoom = (roomId: string) => {
    if (confirm(`Delete room "${roomId}"?`)) {
      removeChatRoom(roomId)
    }
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        {/* 📝 Header */}
        <h1 className="text-3xl font-bold mb-8">💬 Chat Rooms</h1>

        {/* ➕ Create/Join Room Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {isCreating ? "Create New Room" : "Join Existing Room"}
          </h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Room ID {isCreating ? "(Create)" : "(Join)"}
              </label>
              <input
                {...register("roomId")}
                type="text"
                placeholder="e.g., room-123, my-chat, etc."
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>
            
            {isCreating && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Room Name (Optional)
                </label>
                <input
                  {...register("roomName")}
                  type="text"
                  placeholder="e.g., My Awesome Chat"
                  className="w-full p-3 border rounded-lg"
                />
              </div>
            )}

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                {isCreating ? "Create & Join" : "Join Room"}
              </button>
              
              <button
                type="button"
                onClick={() => setIsCreating(!isCreating)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                {isCreating ? "Switch to Join" : "Switch to Create"}
              </button>
            </div>
          </form>
        </div>

        {/* 📋 Your Chat Rooms */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Your Recent Rooms</h2>
          
          {chatRooms.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No rooms yet. Create or join one above!
            </p>
          ) : (
            <div className="space-y-3">
              {chatRooms.map((room) => (
                <div
                  key={room.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold">{room.name}</h3>
                    <p className="text-sm text-gray-500">ID: {room.id}</p>
                    <p className="text-xs text-gray-400">
                      Last active: {new Date(room.lastActivity).toLocaleString()}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/chat/${room.id}`)}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Open
                    </button>
                    
                    <button
                      onClick={() => handleDeleteRoom(room.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
