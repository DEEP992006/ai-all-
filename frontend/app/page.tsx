"use client"
import usesocket from '@/hooks/socket';
import React, { useEffect } from 'react'
import { io } from "socket.io-client";

const page = () => {

  const {isconn,server} = usesocket()
  
  
useEffect(() => {
  if (!isconn || !server) return
   // � EMIT FIRST
   server.emit("join",{"data":"hey"}) 
   // � THEN LISTEN
   server.on("join", (data) => {
     console.log("server response:", data)
     
    })
    
  
}, [isconn,server])

  return (
    <div>
      Home
    </div>
  )
}

export default page
