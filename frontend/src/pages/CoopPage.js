import { useContext, useRef, useState } from "react";
import { QuestionContext } from "../contexts/QuestionContext";
import parse from "html-react-parser";
import Editor from "@monaco-editor/react";
import { Box, Button, TextField } from "@mui/material";
import { socket } from "../components/common/WebSocket";
import { MatchContext } from "../contexts/MatchContext";
import ChatBox from "../components/common/ChatBox";
import { CoopContext } from "../contexts/CoopContext";
import axios from "axios";
import SelectLanguage from "../components/common/SelectLanguage";

function CoopPage(props) {
  const { question } = useContext(QuestionContext);
  const { match } = useContext(MatchContext);
  const {
    message,
    code,
    language,
    consoleResult,
    setLanguage,
    setCode,
    setMessage,
    setConsoleResult,
  } = useContext(CoopContext);

  const [hide, setHide] = useState(true);
  const [showConsole, setShowConsole] = useState(false);
  const [chatHeight, setChatHeight] = useState(5);
  const editorRef = useRef(null);
  const monacoRef = useRef(null);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
    monacoRef.current = monaco;
  }

  // function getCursorPos() {
  //   console.log(editorRef.current.getPosition()); //get current position useful to show peer where you are currently at
  // }
  function onHide() {
    setHide(true);
    setChatHeight(5);
  }
  function onShow() {
    setHide(false);
    setChatHeight(30);
  }

  function onSubmitChat(e) {
    if (e.keyCode === 13) {
      let currentMessage = [...message];
      currentMessage.push({
        user: "me",
        data: e.target.value,
      });
      setMessage(currentMessage);
      socket.emit("room-message", match, {
        user: "edwin", //change to username
        data: e.target.value,
      });
    }
  }
  const onRun = async () => {
    try {
      const r1 = await axios.post(
        "http://localhost:5000/api/v1/judge/submission",
        { language_id: language.id, source_code: code }
      );
      const { data } = await axios.get(
        `http://localhost:5000/api/v1/judge/submission?token=${r1.data.token}`
      );
      socket.emit("code-submission", match, {
        stdout: data.stdout ? atob(data.stdout) : "None",
        time: data.time,
        memory: data.memory,
        stderr: data.stderr ? atob(data.stderr) : "None",
        compile_output: data.compile_output,
        message: data.message ? atob(data.message) : "None",
        status: data.status,
      });
      setConsoleResult({
        stdout: data.stdout ? atob(data.stdout) : "None",
        time: data.time,
        memory: data.memory,
        stderr: data.stderr ? atob(data.stderr) : "None",
        compile_output: data.compile_output,
        message: data.message ? atob(data.message) : "None",
        status: data.status,
      });
    } catch (e) {
      console.log(e.message);
    }
  };
  function handleLanguageChange(event) {
    setLanguage(JSON.parse(event.target.value));
    socket.emit("code-language", match, event.target.value);
  }
  function handleCodeChanges(code) {
    setCode(code);
    socket.emit("code-changes", match, code);
  }

  return (
    <>
      <div className="problem-page-container">
        <div className="problem-description-container">
          {parse(question["problem"])}
        </div>
        <div className="editor-container">
          <div
            className="editor-component"
            style={{ height: `${100 - chatHeight}%` }}
          >
            <Editor
              height="100%"
              language={language?.raw}
              theme="vs-dark"
              value={code}
              onChange={handleCodeChanges}
              onMount={handleEditorDidMount}
              options={{
                inlineSuggest: true,
                fontSize: "16px",
                formatOnType: true,
                autoClosingBrackets: true,
                minimap: { scale: 10 },
              }}
            />
          </div>
          <div
            className="console-and-chat-container"
            style={{ height: `${chatHeight}%` }}
          >
            {hide && (
              <Button variant="contained" color="secondary" onClick={onShow}>
                Show
              </Button>
            )}
            {!hide && (
              <>
                <div className="console-options">
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={onHide}
                    sx={{ marginInline: 1 }}
                  >
                    Hide
                  </Button>
                  {!showConsole ? (
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={setShowConsole}
                    >
                      Console
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => setShowConsole(false)}
                    >
                      Chat
                    </Button>
                  )}
                  <SelectLanguage
                    language={language}
                    handleChange={handleLanguageChange}
                  />
                </div>
                {showConsole ? (
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
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={onRun}
                    >
                      Run
                    </Button>
                  </>
                ) : (
                  <div className="chat-message-container">
                    <div className="chat-message">
                      <ChatBox />
                    </div>
                    <div className="chat-input">
                      <TextField
                        style={{ backgroundColor: "#cccccc" }}
                        fullWidth
                        size="small"
                        onKeyDown={onSubmitChat}
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default CoopPage;
