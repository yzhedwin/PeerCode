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
          Easy
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
          Medium
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
          Hard
        </Button>
      </div>
    </div>
  );
}

export default Match;
