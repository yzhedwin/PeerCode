import axios from "axios";
import { forwardRef, useEffect, useState } from "react";
import { io } from "socket.io-client";

// "undefined" means the URL will be computed from the `window.location` object
const URL =
	process.env.NODE_ENV === "production" ? "" : "http://localhost:3001";

export const socket = io(URL, {
	autoConnect: false,
});

const Websocket = forwardRef((props, difficultyRef) => {
	const [isConnected, setIsConnected] = useState(socket.connected);
	const { findMatch, setSuccess } = props;
	function initMatchQueue() {
		addUserToQueue(difficultyRef.current);
	}
	function addUserToQueue() {
		try {
			console.log(difficultyRef.current);
			socket.emit("joinMatchmaking", {
				userId: socket.id,
				difficulty: difficultyRef.current,
			});
			console.log("add user");
		} catch (e) {
			console.log(e.message);
		}
	}

	function onConnect() {
		setIsConnected(true);
		console.log("connected");
	}

	function onDisconnect() {
		console.log("disconnect event");
		setIsConnected(false);
		//dequeue?
	}
	function onMatchSuccess(msg) {
		console.log(msg);
		setSuccess(true);
	}
	useEffect(() => {
		console.log(findMatch);
		if (findMatch) {
			socket.connect();
		} else {
			socket.disconnect();
		}
	}, [findMatch]);

	useEffect(() => {
		socket.on("connect", onConnect);
		socket.on("disconnect", onDisconnect);
		socket.on("initMatchQueue", initMatchQueue);
		socket.on("matchSuccess", onMatchSuccess);

		return () => {
			socket.off("connect", onConnect);
			socket.off("disconnect", onDisconnect);
			socket.off("initMatchQueue", initMatchQueue);
			socket.off("matchSuccess", onMatchSuccess);
		};
	}, []);
	return <></>;
});

export default Websocket;
