import { useContext } from "react";
import { ProblemContext } from "../../contexts/ProblemContext";
import { Box } from "@mui/material";
import ConsoleButton from "./ConsoleButton";

function Console(props) {
  const { onRun } = props;
  const { consoleResult } = useContext(ProblemContext);
  return (
    <>
      <Box
        className="console-message"
        sx={{
          backgroundColor: "primary.console",
          color: "primary.contrastText",
        }}
      >
        <div>
          <div>
            <strong>Status: </strong>
            {consoleResult?.status?.description}
          </div>
          <strong>Time: </strong>
          {consoleResult?.time ? consoleResult?.time + "s" : ""}
        </div>
        <div>
          <strong>Memory: </strong>
          {consoleResult?.memory}
        </div>
        <div>
          <strong>Message: </strong>
          {consoleResult?.message}
        </div>
        <div>
          <strong>Output: </strong>
          {consoleResult?.stdout}
        </div>
      </Box>

      <ConsoleButton onClick={onRun} title={"Run"} />
    </>
  );
}

export default Console;
