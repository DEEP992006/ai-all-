"use client"

import { useSocketStore } from "@/store/socketStore"
import { useEmailCacheStore } from "@/store/emailCacheStore"
import { useEffect } from "react"

// 🔔 Notification type interface
interface SocketNotification {
  type: "join" | "leave" | "message"
  message: string
  userName: string
  userId: string
  messageContent?: string
  timestamp: string
}

// 🔔 Global notification listener hook
export const useNotificationListener = () => {
  const { socket, isConnected } = useSocketStore()
  const { getEmail } = useEmailCacheStore()

  useEffect(() => {
    if (!isConnected || !socket) return

    // 🎧 Listen for all notifications
    socket.on("notification", (data: SocketNotification) => {
      console.log("🔔 Notification received:", data)

      // 🔔 Request notification permission if not granted
      if (Notification.permission === "default") {
        Notification.requestPermission()
      }

      // 📢 Show browser notification
      if (Notification.permission === "granted") {
        const userEmail = getEmail(data.userId) || data.userName
        
        let notificationTitle = ""
        let notificationBody = ""
        let icon = "🔔"

        // 🎨 Customize notification based on type
        switch (data.type) {
          case "join":
            notificationTitle = "👋 User Joined"
            notificationBody = `${userEmail} joined the room`
            icon = "👋"
            break
          
          case "leave":
            notificationTitle = "👋 User Left"
            notificationBody = `${userEmail} left the room`
            icon = "👋"
            break
          
          case "message":
            notificationTitle = `💬 Message from ${userEmail}`
            notificationBody = data.messageContent || data.message
            icon = "💬"
            break
        }

        // 🚀 Create and show notification
        new Notification(notificationTitle, {
          body: notificationBody,
          icon: `/notification-icon.png`, // You can add an icon file
          badge: `/badge-icon.png`,
          tag: data.type, // Group notifications by type
          requireInteraction: false,
          silent: false,
        })
      }
    })

    // 🧹 Cleanup listener on unmount
    return () => {
      socket.off("notification")
    }
  }, [socket, isConnected, getEmail])
}
