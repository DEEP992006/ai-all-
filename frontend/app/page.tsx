"use client"

import { useSocketStore } from "@/store/socketStore"
import { useAuth } from "@clerk/nextjs"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

// 🏠 Home page component
const page = () => {
  const { isConnected, socket } = useSocketStore()
  const { userId } = useAuth()
  const [messages, setMessages] = useState<{ message: string; sender: string }[]>([])
  
  // 📝 React Hook Form setup
  const { register, handleSubmit, reset } = useForm<{ message: string }>()

  useEffect(() => {
    if (!isConnected || !socket) return

    // 🚪 Join chat room
    socket.emit("join-room", "room-123")

    // 📥 Listen for messages
    socket.on("receive-message", (data: { message: string; sender: string }) => {
      console.log("New msg:", data)
      // ✅ Only add messages from other users
      if (data.sender !== userId) {
        setMessages((prev) => [...prev, data])
      }
    })

    // 🧹 Cleanup listener on unmount
    return () => {
      socket.off("receive-message")
    }
  }, [isConnected, socket, userId])

  // 📤 Handle message submission
  const onSubmit = (data: { message: string }) => {
    if (!socket || !data.message.trim()) return

    // 🚀 Send message to room
    socket.emit("send-message", {
      roomId: "room-123",
      message: data.message,
      sender: userId,
    })

    // ➕ Add own message to local state
    setMessages((prev) => [...prev, { message: data.message, sender: userId || "" }])
    reset()
  }

  return (
    <div className="flex flex-col h-screen p-4">
      <div className="flex-1 overflow-y-auto mb-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 flex ${msg.sender === userId ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`p-3 rounded-lg max-w-xs ${
                msg.sender === userId ? "bg-blue-500 text-white" : "bg-gray-300 text-black"
              }`}
            >
              {msg.message}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
        <input
          {...register("message")}
          type="text"
          placeholder="Type a message..."
          className="flex-1 p-2 border rounded"
        />
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
          Send
        </button>
      </form>
    </div>
  )
}

export default page