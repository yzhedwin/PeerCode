import Button from "@mui/material/Button";
import { socket } from "../common/WebSocket";

const match_easy = async () => {
  try {
    const response = await socket
      .timeout(1000)
      .emitWithAck("match_easy", socket.id);
    console.log(response);
  } catch (err) {
    console.log("no match");
  }
};
const match_medium = async () => {
  try {
    const response = await socket
      .timeout(1000)
      .emitWithAck("match_medium", socket.id);
    console.log(response);
  } catch (err) {
    console.log("no match");
  }
};
const match_hard = async () => {
  try {
    const response = await socket
      .timeout(1000)
      .emitWithAck("match_hard", socket.id);
    console.log(response);
  } catch (err) {
    console.log("no match");
  }
};

function Match() {
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
          <div className="match-difficulty-text">Easy</div>
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
          <div className="match-difficulty-text">Medium</div>
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
          <div className="match-difficulty-text">Hard</div>
        </Button>
      </div>
    </div>
  );
}

export default Match;
