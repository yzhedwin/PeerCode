import Button from "@mui/material/Button";
import { socket } from "../common/WebSocket";
import { SnackBarContext } from "../../contexts/SnackBarContext";
import { useContext, useEffect, useState } from "react";
import { MatchContext } from "../../contexts/MatchContext";
import { CircularProgress } from "@mui/material";

var timeout_id_easy = null;
var timeout_id_medium = null;
var timeout_id_hard = null;

function Match() {
  const [loadingEasy, setLoadingEasy] = useState(false);
  const [loadingMedium, setLoadingMedium] = useState(false);
  const [loadingHard, setLoadingHard] = useState(false);
  const { setOpenSnackBar, setSB } = useContext(SnackBarContext);
  const {
    match,
    findMatchEasy,
    findMatchMedium,
    findMatchHard,
    setMatch,
    setFindMatchEasy,
    setFindMatchMedium,
    setFindMatchHard,
  } = useContext(MatchContext);

  const match_easy = () => {
    socket.emit("match_easy", socket.id);
    setSB({ msg: "[Easy]Finding a match!", severity: "success" });
    setOpenSnackBar(true);
    setFindMatchEasy(true);
    setLoadingEasy(true);
  };
  const match_medium = () => {
    socket.emit("match_medium", socket.id);
    setSB({ msg: "[Medium]Finding a match!", severity: "success" });
    setOpenSnackBar(true);
    setFindMatchMedium(true);
    setLoadingMedium(true);
  };
  const match_hard = () => {
    socket.emit("match_hard", socket.id);
    setSB({ msg: "[Hard]Finding a match!", severity: "success" });
    setOpenSnackBar(true);
    setFindMatchHard(true);
    setLoadingHard(true);
  };
  useEffect(() => {
    if (findMatchEasy) {
      timeout_id_easy = setTimeout(() => {
        setFindMatchEasy(false);
        setMatch(false);
        setSB({ msg: "You are alone", severity: "error" });
        socket.emit("match_cancel_easy", socket.id);
        setOpenSnackBar(true);
        setLoadingEasy(false);
      }, 5000);
    }
  }, [findMatchEasy]);

  useEffect(() => {
    if (findMatchMedium) {
      timeout_id_medium = setTimeout(() => {
        setFindMatchMedium(false);
        setMatch(false);
        setSB({ msg: "You are alone", severity: "error" });
        socket.emit("match_cancel_medium", socket.id);
        setOpenSnackBar(true);
        setLoadingMedium(false);
      }, 5000);
    }
  }, [findMatchMedium]);

  useEffect(() => {
    if (findMatchHard) {
      timeout_id_hard = setTimeout(() => {
        setFindMatchHard(false);
        setMatch(false);
        setSB({ msg: "You are alone", severity: "error" });
        socket.emit("match_cancel_hard", socket.id);
        setOpenSnackBar(true);
        setLoadingHard(false);
      }, 5000);
    }
  }, [findMatchHard]);

  useEffect(() => {
    if (match) {
      clearTimeout(timeout_id_easy);
      clearTimeout(timeout_id_medium);
      clearTimeout(timeout_id_hard);
    }
  }, [match]);
  return (
    <div className="match-container">
      <div className="match-container-title">Match</div>
      <div className="match-difficulty-container">
        <Button
          style={{
            maxWidth: "150px",
            maxHeight: "80px",
            minWidth: "150px",
            minHeight: "80px",
          }}
          variant="contained"
          size="large"
          color="question_easy"
          onClick={match_easy}
        >
          {loadingEasy ? (
            <div className="match-difficulty-text">
              <CircularProgress />
            </div>
          ) : (
            <div className="match-difficulty-text">Easy</div>
          )}
        </Button>
        <Button
          style={{
            maxWidth: "150px",
            maxHeight: "80px",
            minWidth: "150px",
            minHeight: "80px",
          }}
          variant="contained"
          size="large"
          color="question_medium"
          onClick={match_medium}
        >
          {loadingMedium ? (
            <div className="match-difficulty-text">
              <CircularProgress />
            </div>
          ) : (
            <div className="match-difficulty-text">Medium</div>
          )}
        </Button>
        <Button
          style={{
            maxWidth: "150px",
            maxHeight: "80px",
            minWidth: "150px",
            minHeight: "80px",
          }}
          variant="contained"
          size="large"
          color="question_hard"
          onClick={match_hard}
        >
          {loadingHard ? (
            <div className="match-difficulty-text">
              <CircularProgress />
            </div>
          ) : (
            <div className="match-difficulty-text">Hard</div>
          )}
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            socket.emit("rooms");
          }}
        >
          room
        </Button>
      </div>
    </div>
  );
}

export default Match;
