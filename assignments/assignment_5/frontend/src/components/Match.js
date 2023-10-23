import { useContext, useEffect } from "react";
import { socket } from "./Websocket";
import CoolButton from "./button/CoolButton";
import { MATCHMAKING_TIMEOUT } from "../utils/constants";
import { MatchContext } from "../contexts/MatchContext";

var timeout_id = null;
export default function Match() {
	const { match, setMatch, setFindMatch, findMatch, hasInit } =
		useContext(MatchContext);

	function addUserToQueue(difficulty) {
		try {
			socket.emit("joinMatchmaking", {
				userId: socket.id,
				difficulty: difficulty,
			});
			console.log("add user");
		} catch (e) {
			console.log(e.message);
		}
	}
	function onMatch(difficulty) {
		setFindMatch(true);
		addUserToQueue(difficulty);
		setMatch({ success: false });
		timeout_id = setTimeout(() => {
			setFindMatch(false);
		}, MATCHMAKING_TIMEOUT);
	}

	useEffect(() => {
		if (match?.success) {
			clearTimeout(timeout_id);
			timeout_id = null;
		}
	}, [match.success]);

	return (
		<>
			<div
				className="match-btn-container"
				style={{ display: "flex", justifyContent: "space-around", flex: 1 }}
			>
				{match.success ? (
					<div>Matched: {match?.room_id}</div>
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
							disabled={!hasInit}
						/>
						<CoolButton
							onClick={() => onMatch("medium")}
							text={"Medium"}
							loading={findMatch}
							disabled={!hasInit}
						/>
						<CoolButton
							onClick={() => onMatch("hard")}
							text={"Hard"}
							loading={findMatch}
							disabled={!hasInit}
						/>
					</>
				)}
			</div>
		</>
	);
}
