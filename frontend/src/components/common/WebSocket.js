import { useCallback, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { SnackBarContext } from "../../contexts/SnackBarContext";
import { MatchContext } from "../../contexts/MatchContext";
import { ProblemContext } from "../../contexts/ProblemContext";

const socketUrl = "http://localhost:5002";
export const socket = io(socketUrl, {
  autoConnect: false,
});

export default function WebSocket() {
  // eslint-disable-next-line no-unused-vars
  const [isConnected, setIsConnected] = useState(socket.connected);
  const { setMatch } = useContext(MatchContext);
  const { message, setMessage, setCode, setLanguage, setConsoleResult } =
    useContext(ProblemContext);
  const { setOpenSnackBar, setSB } = useContext(SnackBarContext);
  const [newMessage, setNewMessage] = useState({});

  function onConnect() {
    console.log("connected");
    setIsConnected(true);
  }

  function onDisconnect() {
    console.log("client is disconnected");
    setIsConnected(false);
  }
  function onMatch(room) {
    setSB({ msg: "Found a match!", severity: "success" });
    setOpenSnackBar(true);
    socket.emit("join_room", room);
    setMatch(room);
  }
  const onCodeChanged = useCallback((code) => {
    setCode(code);
  }, []);

  const onChatChanged = (msg) => {
    setNewMessage(msg);
  };
  const onConsoleChanged = (result) => {
    setConsoleResult(result);
  };
  const onCodeLanguageChanged = (language) => {
    setLanguage(JSON.parse(language));
  };

  useEffect(() => {
    let update = [...message];
    update.push(newMessage);
    setMessage(update);
  }, [newMessage]);

  useEffect(() => {
    socket.connect();
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("match", onMatch);
    socket.on("chatroom-code", onCodeChanged);
    socket.on("chatroom-chat", onChatChanged);
    socket.on("chatroom-console-result", onConsoleChanged);
    socket.on("chatroom-code-language", onCodeLanguageChanged);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("match", onMatch);
      socket.off("chatroom-code", onCodeChanged);
      socket.off("chatroom-chat", onChatChanged);
      socket.off("chatroom-console-result", onConsoleChanged);
      socket.off("chatroom-code-language", onCodeLanguageChanged);

      socket.disconnect();
    };
  }, []);
}
