import { socket } from "../common/WebSocket";
import { SnackBarContext } from "../../contexts/SnackBarContext";
import { useContext, useEffect, useState } from "react";
import { MatchContext } from "../../contexts/MatchContext";
import { Box } from "@mui/material";
import { QuestionContext } from "../../contexts/QuestionContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CoolButton from "../common/CoolButton";
import { ProblemContext } from "../../contexts/ProblemContext";

var timeout_id = {
	easy: null,
	medium: null,
	hard: null,
};

function Match() {
	const { setOpenSnackBar, setSB } = useContext(SnackBarContext);
	const { setQuestion } = useContext(QuestionContext);
	const { match, findMatch, setMatch, setFindMatch } = useContext(MatchContext);
	const { setMessage } = useContext(ProblemContext);
	const navigate = useNavigate();

	const getMatch = (difficulty) => {
		console.log(timeout_id);
		if (timeout_id[difficulty.toLowerCase()] === null) {
			socket.emit("match", socket.id, difficulty.toLowerCase());
			setSB({ msg: `[${difficulty}]Finding a match!`, severity: "success" });
			setOpenSnackBar(true);
			setFindMatch((prevState) => {
				return { ...prevState, [difficulty.toLowerCase()]: true };
			});
		}
	};

	useEffect(() => {
		if (findMatch.easy) {
			timeout_id["easy"] = setTimeout(() => {
				setFindMatch((prevState) => {
					return { ...prevState, easy: false };
				});
				setMatch(false);
				setSB({ msg: "You are alone", severity: "error" });
				socket.emit("match_cancel", socket.id, "easy");
				setOpenSnackBar(true);
				timeout_id["easy"] = null;
			}, 5000);
		}
	}, [findMatch.easy]);

	useEffect(() => {
		if (findMatch.medium) {
			timeout_id["medium"] = setTimeout(() => {
				setFindMatch((prevState) => {
					return { ...prevState, medium: false };
				});
				setMatch(false);
				setSB({ msg: "You are alone", severity: "error" });
				socket.emit("match_cancel", socket.id, "medium");
				setOpenSnackBar(true);
			}, 5000);
		}
	}, [findMatch.medium]);

	useEffect(() => {
		if (findMatch.hard) {
			timeout_id["hard"] = setTimeout(() => {
				setFindMatch((prevState) => {
					return { ...prevState, hard: false };
				});
				setMatch(false);
				setSB({ msg: "You are alone", severity: "error" });
				socket.emit("match_cancel", socket.id, "hard");
				setOpenSnackBar(true);
				timeout_id["hard"] = null;
			}, 5000);
		}
	}, [findMatch.hard]);

	const getRandomEasyQuestion = async () => {
		try {
			const { data } = await axios.get(
				`http://localhost:5000/api/v1/question/problem/3Sum`
			);
			setQuestion({ titleSlug: "3Sum", problem: data });
			navigate("/match");
		} catch (e) {
			setSB({ msg: e.message, severity: "error" });
			setOpenSnackBar(true);
		}
	};
	useEffect(() => {
		if (match) {
			//match is either false or room_id
			clearTimeout(timeout_id["easy"]);
			clearTimeout(timeout_id["medium"]);
			clearTimeout(timeout_id["hard"]);
			timeout_id["easy"] = null;
			timeout_id["medium"] = null;
			timeout_id["hard"] = null;
			setFindMatch({});
			setMessage([]);
			getRandomEasyQuestion();
		}
	}, [match]);

	return (
		<Box
			className="match-container"
			sx={{
				backgroundColor: "secondary.main",
				color: "secondary.contrastText",
			}}
		>
			<div className="match-container-title">Match</div>
			<div className="match-difficulty-container">
				<CoolButton
					text={"Easy"}
					loading={findMatch.easy}
					onClick={() => getMatch("Easy")}
				/>
				<CoolButton
					text={"Medium"}
					loading={findMatch.medium}
					onClick={() => getMatch("Medium")}
				/>
				<CoolButton
					text={"Hard"}
					loading={findMatch.hard}
					onClick={() => getMatch("Hard")}
				/>
			</div>
		</Box>
	);
}

export default Match;
