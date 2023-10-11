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

	async function addUserToQueue(difficulty) {
		try {
			await axios.post("http://localhost:3002/api/matchmaking/queue", {
				userId: socket.id,
				difficulty: difficulty.toLowerCase(),
			});
		} catch (e) {
			console.log(e.message);
		}
	}
	useEffect(() => {
		if (conn) {
			socket.connect();
		} else {
			socket.disconnect();
		}
	}, [conn]);

	useEffect(() => {
		function onConnect() {
			setIsConnected(true);
			addUserToQueue(difficulty);
		}

		function onDisconnect() {
			setIsConnected(false);
			//dequeue?
		}
		function onMatchSuccess(msg) {
			console.log(msg);
			setSuccess(true);
		}

		socket.on("connect", onConnect);
		socket.on("disconnect", onDisconnect);
		socket.on("matchFound", onMatchSuccess);

		return () => {
			socket.off("connect", onConnect);
			socket.off("disconnect", onDisconnect);
			socket.off("matchFound", onMatchSuccess);
		};
	}, []);
	return <></>;
}
