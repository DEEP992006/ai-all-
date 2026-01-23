"use client"

import { useEffect } from "react"
import { useAuth } from "@clerk/nextjs"
import { useSocketStore } from "@/store/socketStore"

// 🔌 Socket initialization component
export default function SocketInit() {
  const { getToken, isSignedIn } = useAuth()
  const connect = useSocketStore((s) => s.connect)

  useEffect(() => {
    if (!isSignedIn) return

    // 🚀 Initialize socket connection with auth token
    const init = async () => {
      const token = await getToken()
      if (token) connect(token)
    }
console.log("success");

    init()
  }, [isSignedIn])

  return null // 👈 Logic-only component
}
