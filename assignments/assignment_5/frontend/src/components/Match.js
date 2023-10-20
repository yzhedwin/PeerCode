import { useEffect, useRef, useState } from "react";
import Websocket, { socket } from "./Websocket";
import CoolButton from "./button/CoolButton";
import { MATCHMAKING_TIMEOUT } from "../utils/constants";

var timeout_id = null;
export default function Match(props) {
	const [success, setSuccess] = useState(false);
	const [findMatch, setFindMatch] = useState(false);
	const [roomID, setRoomID] = useState();
	const difficultyRef = useRef();

	function onMatch(difficulty) {
		setFindMatch(true);
		difficultyRef.current = difficulty;
		setSuccess(false);
		timeout_id = setTimeout(() => {
			setFindMatch(false);
		}, MATCHMAKING_TIMEOUT);
	}

	useEffect(() => {
		if (success) {
			clearTimeout(timeout_id);
			timeout_id = null;
		}
	}, [success]);

	return (
		<>
			<Websocket
				findMatch={findMatch}
				ref={difficultyRef}
				setSuccess={setSuccess}
				setRoomID={setRoomID}
			/>
			<div
				className="match-btn-container"
				style={{ display: "flex", justifyContent: "space-around", flex: 1 }}
			>
				{success ? (
					<div>Matched: {roomID}</div>
				) : findMatch ? (
					<CoolButton
						text={"Cancel"}
						loading={findMatch}
						onClick={() => {
							clearTimeout(timeout_id);
							setFindMatch(false);
							socket.emit("cancelMatchmaking");
						}}
					/>
				) : (
					<>
						<CoolButton
							onClick={() => onMatch("easy")}
							text={"Easy"}
							loading={findMatch}
						/>
						<CoolButton
							onClick={() => onMatch("medium")}
							text={"Medium"}
							loading={findMatch}
						/>
						<CoolButton
							onClick={() => onMatch("hard")}
							text={"Hard"}
							loading={findMatch}
						/>
					</>
				)}
			</div>
		</>
	);
}
