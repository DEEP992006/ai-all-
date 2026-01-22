import { useEffect, useState } from "react"
import { io, Socket } from "socket.io-client"
interface socket {
    isconn:boolean,
    server: null | Socket
}

const usesocket = () => {
    const [socket, setisconn] = useState<socket>({
        isconn:false,
        server:null
    })
    useEffect(() => {
        const server = io("http://localhost:8080")
    
    // 🔌 Socket connection listener
    server.on("connect", async() => {
      setisconn({"server":server,isconn:true})
    })

  }, [])
return socket
}

export default usesocket