import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import Websocket from "./Websocket";
import { socket } from "./Websocket";
var timeout_id = null;
export default function Match(props) {
	const { difficulty } = props;
	const [findMatch, setFindMatch] = useState(Boolean);
	const [success, setSuccess] = useState(false);
	function onMatch() {
		setFindMatch(true);
		setSuccess(false);
		socket.emit(
			"joinMatchmaking",
			{ userId: socket.id },
			difficulty.toLowerCase()
		);
		timeout_id = setTimeout(() => {
			setFindMatch(false);
		}, 5000);
	}
	useEffect(() => {
		if (success) {
			clearTimeout(timeout_id);
			timeout_id = null;
		}
	}, [success]);

	return (
		<>
			<Websocket conn={findMatch} setSuccess={setSuccess} />
			<div className="match-btn-container">
				<Button onClick={onMatch}>Match</Button>
			</div>
		</>
	);
}
