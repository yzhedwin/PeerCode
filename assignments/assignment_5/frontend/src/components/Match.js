import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import Websocket from "./Websocket";
import { socket } from "./Websocket";

var timeout_id = null;
export default function Match(props) {
	const { difficulty } = props;
	const [findMatch, setFindMatch] = useState(Boolean);
	const [success, setSuccess] = useState(false);
	async function onMatch() {
		setFindMatch(true);
		setSuccess(false);
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
			<Websocket
				difficulty={difficulty}
				conn={findMatch}
				setSuccess={setSuccess}
			/>
			<div className="match-btn-container">
				<Button
					onClick={() => {
						socket.disconnect();
					}}
				>
					Cancel Match
				</Button>
				<Button onClick={onMatch}>Match</Button>
			</div>
		</>
	);
}
