"use client"
import React, { useEffect } from 'react'
import { io } from "socket.io-client";

const page = () => {

  useEffect(() => {
    const server = io("http://localhost:8080")
    
    // 🔌 Socket connection listener
    server.on("connection", async (data: any) => {
      console.log(data);
    })
    
    // 📤 Emit join event to server
    server.emit("join", { "data": "DDd" })
    
    // 📥 Listen for join response
    server.on("join", async (data) => {
      console.log(data);
    })
  }, [])

  return (
    <div>
      Home
    </div>
  )
}

export default page
