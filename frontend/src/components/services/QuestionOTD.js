import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
function QuestionOTD() {
  const [qotd, setQOTD] = useState({});
  const getQOTD = async () => {
    const { data } = await axios.get(
      "http://localhost:5000/api/v1/question/day"
    );
    setQOTD(data);
  };
  useEffect(() => {
    getQOTD();
  }, []);

  const handleClick = () => {
    console.log(qotd);
  };

  return (
    <div className="questionOTD-container">
      <div className="questionOTD-container-title">Question of the day</div>
      <div className="questionOTD-btn">
        <Button variant="contained" color="question_OTD" onClick={handleClick}>
          {qotd?.title}
        </Button>
      </div>
    </div>
  );
}

export default QuestionOTD;
