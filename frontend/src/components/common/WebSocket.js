import { Button } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { SnackBarContext } from "../../contexts/SnackBarContext";
import { MatchContext } from "../../contexts/MatchContext";

const socketUrl = "http://localhost:5002";
export const socket = io(socketUrl, {
  autoConnect: false,
});

export default function WebSocket() {
  // eslint-disable-next-line no-unused-vars
  const [isConnected, setIsConnected] = useState(socket.connected);
  const { setMatch } = useContext(MatchContext);
  const { setOpenSnackBar, setSB } = useContext(SnackBarContext);

  function onConnect() {
    console.log("connected");
    setIsConnected(true);
  }

  function onDisconnect() {
    console.log("client is disconnected");
    setIsConnected(false);
  }
  function onMatch(msg) {
    setSB({ msg: "Found a match!", severity: "success" });
    setOpenSnackBar(true);
    socket.emit("join_room", msg);
    setMatch(msg);
  }

  useEffect(() => {
    socket.connect();
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("match", onMatch);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("match", onMatch);
      socket.disconnect();
    };
  }, []);
}
