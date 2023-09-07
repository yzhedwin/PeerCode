import { Button } from "@mui/material";

function QuestionOTD() {
  return (
    <div className="questionOTD-container">
      <div className="questionOTD-container-title">Question of the day</div>
      <div className="questionOTD-btn">
        <Button variant="contained" color="question_OTD">
          Question fetched from leetcode
        </Button>
      </div>
    </div>
  );
}

export default QuestionOTD;
