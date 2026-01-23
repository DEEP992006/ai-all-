"use client"

import { fetchEmail } from "@/action/useraction"
import { useSocketStore } from "@/store/socketStore"
import { useEmailCacheStore } from "@/store/emailCacheStore"
import { useChatStore } from "@/store/chatStore"
import { useAuth } from "@clerk/nextjs"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useParams, useRouter } from "next/navigation"

// 💬 Dynamic Chat Room Page
export default function ChatRoomPage() {
  const params = useParams()
  const router = useRouter()
  const roomId = params.id as string
  
  // 🔌 Socket connection state
  const { isConnected, socket } = useSocketStore()
  
  // 📧 Email cache store
  const { getEmail, setEmail } = useEmailCacheStore()
  
  // 💬 Chat store
  const { addChatRoom, setActiveRoom, getChatRoom, updateLastActivity } = useChatStore()
  
  // 🔐 Current user authentication
  const { userId } = useAuth()
  
  // 💬 Messages state
  const [messages, setMessages] = useState<{ message: string; sender: string }[]>([])
  
  // 📝 React Hook Form setup
  const { register, handleSubmit, reset } = useForm<{ message: string }>()
  
  // 🏠 Current room info
  const currentRoom = getChatRoom(roomId)

  // 📧 Fetch user email by userId with caching
  const getUserEmail = async (userId: string) => {
    const cachedEmail = getEmail(userId)
    if (cachedEmail) {
      console.log("📦 Email from cache:", cachedEmail)
      return cachedEmail
    }
    
    console.log("🌐 Fetching email from server for:", userId)
    const email = await fetchEmail(userId)
    const result = email || userId
    
    setEmail(userId, result)
    return result
  }
  
  // 🎨 Get initials from email
  const getInitials = (email: string) => {
    return email.slice(0, 2).toUpperCase()
  }

  // 🎧 Socket event listeners
  useEffect(() => {
    // 🔔 Request notification permission
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission()
    }
    
    if (!isConnected || !socket || !userId || !roomId) return

    // ➕ Add room to store and set as active
    const roomName = currentRoom?.name || `Room ${roomId}`
    addChatRoom(roomId, roomName)
    setActiveRoom(roomId)

    // 🚪 Join chat room and notify others
    const joinRoom = async () => {
      const userName = await getUserEmail(userId)
      socket.emit("join-room", { roomId, userName })
    }
    joinRoom()

    // 📥 Listen for messages
    socket.on("receive-message", async (data: { message: string; sender: string }) => {
      console.log("New msg:", data)
      
      // 🔄 Update last activity
      updateLastActivity(roomId)
      
      // ✅ Only add messages from other users
      if (data.sender !== userId) {
        const senderEmail = await getUserEmail(data.sender)
        console.log("Sender email:", senderEmail)
        
        setMessages((prev) => [...prev, { message: data.message, sender: senderEmail }])
      }
    })

    // 🧹 Cleanup: leave room on unmount
    return () => {
      const leaveRoom = async () => {
        const userName = await getUserEmail(userId)
        socket.emit("leave-room", { roomId, userName })
      }
      leaveRoom()
      socket.off("receive-message")
    }
  }, [isConnected, socket, userId, roomId])

  // 📤 Handle message submission
  const onSubmit = async (data: { message: string }) => {
    if (!socket || !data.message.trim() || !userId) return

    const currentUserEmail = await getUserEmail(userId)

    socket.emit("send-message", {
      roomId,
      message: data.message,
      sender: userId,
      userName: currentUserEmail,
    })

    setMessages((prev) => [...prev, { message: data.message, sender: currentUserEmail }])
    
    // 🔄 Update last activity
    updateLastActivity(roomId)
    
    reset()
  }

  return (
    <div className="flex flex-col h-screen">
      {/* 🎯 Room Header */}
      <div className="bg-blue-500 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/chat")}
            className="px-3 py-1 bg-white text-blue-500 rounded hover:bg-gray-100"
          >
            ← Back
          </button>
          <div>
            <h1 className="text-xl font-bold">{currentRoom?.name || roomId}</h1>
            <p className="text-sm opacity-90">Room ID: {roomId}</p>
          </div>
        </div>
        <div className="text-sm">
          {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
        </div>
      </div>

      {/* 💬 Messages display area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <p className="text-lg">👋 Welcome to {currentRoom?.name || roomId}!</p>
            <p className="text-sm">Start the conversation by sending a message below.</p>
          </div>
        )}
        
        {messages.map((msg, index) => {
          const isCurrentUser = msg.sender.includes(getEmail(userId || "") || userId || "")
          
          return (
            <div
              key={index}
              className={`flex items-end gap-2 ${isCurrentUser ? "justify-end" : "justify-start"}`}
            >
              {!isCurrentUser && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gray-600 text-white text-xs">
                    {getInitials(msg.sender)}
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div
                className={`p-3 rounded-lg max-w-xs ${
                  isCurrentUser ? "bg-blue-500 text-white" : "bg-white text-black shadow"
                }`}
              >
                <div className="text-sm">{msg.message}</div>
              </div>
              
              {isCurrentUser && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-blue-600 text-white text-xs">
                    {getInitials(msg.sender)}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          )
        })}
      </div>

      {/* 📝 Message input form */}
      <form onSubmit={handleSubmit(onSubmit)} className="p-4 bg-white border-t flex gap-2">
        <input
          {...register("message")}
          type="text"
          placeholder="Type a message..."
          className="flex-1 p-3 border rounded-lg"
        />
        <button 
          type="submit" 
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Send
        </button>
      </form>
    </div>
  )
}
