import { useCallback, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { SnackBarContext } from "../../contexts/SnackBarContext";
import { MatchContext } from "../../contexts/MatchContext";
import { ProblemContext } from "../../contexts/ProblemContext";
import { Box, Modal, Typography } from "@mui/material";
import ConsoleButton from "./ConsoleButton";
import { useNavigate } from "react-router-dom";

const socketUrl = "http://localhost:5002";
export const socket = io(socketUrl, {
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
	const { match, setMatch } = useContext(MatchContext);
	const { message, setMessage, setCode, setLanguage, setConsoleResult } =
		useContext(ProblemContext);
	const { setOpenSnackBar, setSB } = useContext(SnackBarContext);
	const [newMessage, setNewMessage] = useState({});
	const [open, setOpen] = useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);
	const navigate = useNavigate();

	function onConnect() {
		console.log("connected");
		setIsConnected(true);
	}

	function onDisconnect() {
		console.log("client is disconnected");
		setIsConnected(false);
	}
	function onMatchSuccess(room) {
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

	function onMatchQuit() {
		handleOpen();
	}

	function onMatchQuitConfirm() {
		setSB({ msg: "Left the match!", severity: "error" });
		setOpenSnackBar(true);
		setMatch(null);
		handleClose();
		socket.emit("connection-lost", match, "User has left");
		navigate("/dashboard");
	}
	function onMatchQuitDeny() {
		let currentMessage = [...message];
		currentMessage.push({
			user: "me",
			data: "refused to leave",
		});
		setMessage(currentMessage);
		socket.emit("room-message", match, {
			user: "edwin",
			data: "refused to leave",
		});
		handleClose();
	}
	function onConnectionLost(msg) {
		setSB({ msg: msg, severity: "error" });
		setOpenSnackBar(true);
		setMatch(null);
	}
	useEffect(() => {
		let update = [...message];
		update.push(newMessage);
		setMessage(update);
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

			socket.disconnect();
		};
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
