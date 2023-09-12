import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socketUrl = "http://localhost:5002";
export const socket = io(socketUrl, {
  autoConnect: false,
});

export default function WebSocket() {
  // eslint-disable-next-line no-unused-vars
  const [isConnected, setIsConnected] = useState(socket.connected);

  function onConnect() {
    console.log("connected");
    setIsConnected(true);
  }

  function onDisconnect() {
    console.log("client is disconnected");
    setIsConnected(false);
  }

  useEffect(() => {
    socket.connect();
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.disconnect();
    };
  }, []);
}
