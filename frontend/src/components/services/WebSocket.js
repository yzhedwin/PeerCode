import { useCallback, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { SnackBarContext } from "../../contexts/SnackBarContext";
import { MatchContext } from "../../contexts/MatchContext";
import { ProblemContext } from "../../contexts/ProblemContext";
import { Box, Modal, Typography } from "@mui/material";
import ConsoleButton from "../common/question/ConsoleButton";
import { useNavigate } from "react-router-dom";
import { FirebaseContext } from "../../contexts/FirebaseContext";
import { QuestionContext } from "../../contexts/QuestionContext";
import axios from "axios";
import { API_GATEWAY, SOCKET_URL } from "../../utils/constants";

export const socket = io(SOCKET_URL, {
    autoConnect: false,
});

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};

export default function WebSocket() {
    // eslint-disable-next-line no-unused-vars
    const [isConnected, setIsConnected] = useState(socket.connected);
    const { match, setMatch, setQuitMatch, setHasInit } =
        useContext(MatchContext);
    const { currentName } = useContext(FirebaseContext);
    const {
        message,
        setMessage,
        setCode,
        setLanguage,
        setConsoleResult,
        setSnippets,
    } = useContext(ProblemContext);
    const { setQuestion } = useContext(QuestionContext);
    const { setOpenSnackBar, setSB } = useContext(SnackBarContext);
    const [newMessage, setNewMessage] = useState({});
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const navigate = useNavigate();

    const onConnect = useCallback(() => {
        console.log("connected");
        setIsConnected(true);
    }, []);

    const onDisconnect = useCallback(() => {
        console.log("client is disconnected");
        setIsConnected(false);
    }, []);

    const initMatchQueue = useCallback(() => {
        console.log("Match Queue initialized");
        setHasInit(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onMatchSuccess = useCallback(async (room, titleSlug) => {
        try {
            setSB({ msg: "Found a match!", severity: "success" });
            setOpenSnackBar(true);
            socket.emit("join_room", room);
            setMatch(room);
            const [question, snippets] = await Promise.all([
                await axios.get(
                    API_GATEWAY + `/api/v1/question/title/${titleSlug}`
                ),
                await axios.get(
                    API_GATEWAY + `/api/v1/question/codesnippets?titleSlug=${titleSlug}`
                ),
            ]);
            setQuestion({
                title: question.data?.title,
                titleSlug: question.data?.titleSlug,
                difficulty: question.data?.difficulty,
                status: question.data?.status,
                problem: question.data?.problem,
            });
            setSnippets(snippets["data"]);
            navigate("/match");
        } catch (e) {
            setSB({ msg: e.message, severity: "error" });
            setOpenSnackBar(true);
        }
    }, []);
    const onCodeChanged = useCallback((code) => {
        setCode(code);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onChatChanged = useCallback((msg) => {
        setNewMessage(msg);
    }, []);
    const onConsoleChanged = useCallback((result) => {
        setConsoleResult(result);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const onCodeLanguageChanged = useCallback((language) => {
        setLanguage(JSON.parse(language));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onMatchQuit = useCallback(() => {
        handleOpen();
    }, []);

    const onMatchQuitConfirm = useCallback(() => {
        setSB({ msg: "Left the match!", severity: "error" });
        setOpenSnackBar(true);
        setMatch(null);
        setQuitMatch(true);
        handleClose();
        socket.emit("connection-lost", match, "User has left");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const onMatchQuitDeny = useCallback(() => {
        let date = new Date();
        const time = `${date.getHours()}:${date.getMinutes()}`;
        let currentMessage = [...message];
        currentMessage.push({
            user: "me",
            data: "refused to leave",
            time: time,
        });
        setMessage(currentMessage);
        socket.emit("room-message", match, {
            user: currentName,
            data: "refused to leave",
            time: time,
        });
        handleClose();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [message, match]);

    const onConnectionLost = useCallback((msg) => {
        setSB({ msg: msg, severity: "error" });
        setOpenSnackBar(true);
        setMatch(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        let update = [...message];
        update.push(newMessage);
        setMessage(update);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newMessage]);

    useEffect(() => {
        socket.connect();
        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
        socket.on("match-success", onMatchSuccess);
        socket.on("match-quit", onMatchQuit);
        socket.on("match-quit-confirm", onMatchQuitConfirm);
        socket.on("connection-lost", onConnectionLost);
        socket.on("chatroom-code", onCodeChanged);
        socket.on("chatroom-chat", onChatChanged);
        socket.on("chatroom-console-result", onConsoleChanged);
        socket.on("chatroom-code-language", onCodeLanguageChanged);
        socket.on("initMatchQueue", initMatchQueue);

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off("match-success", onMatchSuccess);
            socket.off("match-quit", onMatchQuit);
            socket.off("match-quit-confirm", onMatchQuitConfirm);
            socket.off("connection-lost", onConnectionLost);
            socket.off("chatroom-code", onCodeChanged);
            socket.off("chatroom-chat", onChatChanged);
            socket.off("chatroom-console-result", onConsoleChanged);
            socket.off("chatroom-code-language", onCodeLanguageChanged);
            socket.off("initMatchQueue", initMatchQueue);
            socket.disconnect();
            setHasInit(false);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography
                        id="modal-modal-title"
                        variant="h6"
                        color={"white"}
                        component="h2"
                        textAlign={"center"}
                    >
                        Agree to leave?
                    </Typography>
                    <div style={{ display: "flex" }}>
                        <ConsoleButton
                            title={"Yes"}
                            sx={{ marginRight: "auto" }}
                            onClick={() => {
                                socket.emit("match-quit-confirm", match);
                                onMatchQuitConfirm();
                            }}
                        />
                        <ConsoleButton
                            title={"No"}
                            sx={{ marginLeft: "auto" }}
                            onClick={onMatchQuitDeny}
                        />
                    </div>
                </Box>
            </Modal>
        </>
    );
}
