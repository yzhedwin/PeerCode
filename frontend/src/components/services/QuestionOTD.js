import { Box, Button } from "@mui/material";
import { useEffect, useState } from "react";

import axios from "axios";
function QuestionOTD() {
  const [qotd, setQOTD] = useState({});
  const getQOTD = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/v1/question/day"
      );
      setQOTD(data);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    getQOTD();
  }, []);

  const handleClick = () => {
    console.log();
    console.log(qotd);
  };

  return (
    <Box
      className="questionOTD-container"
      sx={{ backgroundColor: "secondary.main" }}
    >
      <Box
        className="questionOTD-container-title"
        sx={{ color: "secondary.contrastText" }}
      >
        Question of the day
      </Box>
      <div className="questionOTD-btn">
        <Button variant="contained" color="question_OTD" onClick={handleClick}>
          {qotd?.title}
        </Button>
      </div>
    </Box>
  );
}

export default QuestionOTD;
