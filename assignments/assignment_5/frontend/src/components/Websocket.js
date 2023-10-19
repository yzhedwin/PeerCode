import axios from "axios";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

// "undefined" means the URL will be computed from the `window.location` object
const URL =
	process.env.NODE_ENV === "production" ? "" : "http://localhost:3001";

export const socket = io(URL, {
	autoConnect: false,
});

export default function Websocket({ conn, setSuccess, difficulty }) {
	const [isConnected, setIsConnected] = useState(socket.connected);

	function onInitMatchQueue(message) {
		addUserToQueue(difficulty);
	}
	function addUserToQueue(difficulty) {
		try {
			socket.emit("joinMatchmaking", {
				userId: socket.id,
				difficulty: difficulty.toLowerCase(),
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
		if (!conn) {
			socket.disconnect();
		}
	}, [conn]);

	useEffect(() => {
		socket.on("connect", onConnect);
		socket.on("disconnect", onDisconnect);
		socket.on("initMatchQueue", onInitMatchQueue);
		socket.on("matchSuccess", onMatchSuccess);

		return () => {
			socket.off("connect", onConnect);
			socket.off("disconnect", onDisconnect);
			socket.off("matchSuccess", onMatchSuccess);
			socket.off("initMatchQueue", onInitMatchQueue);
		};
	}, []);
	return <></>;
}
