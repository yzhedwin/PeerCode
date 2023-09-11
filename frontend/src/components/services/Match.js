import Button from "@mui/material/Button";

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
        >
          <div className="match-difficulty-text">Hard</div>
        </Button>
      </div>
    </div>
  );
}

export default Match;
