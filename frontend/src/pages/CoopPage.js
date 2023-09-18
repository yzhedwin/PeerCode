import { useContext, useEffect, useRef, useState } from "react";
import { QuestionContext } from "../contexts/QuestionContext";
import parse from "html-react-parser";
import Editor from "@monaco-editor/react";
import { Button, TextField } from "@mui/material";
import { socket } from "../components/common/WebSocket";
import { MatchContext } from "../contexts/MatchContext";
import { CodeContext } from "../contexts/CodeContext";
import ChatBox from "../components/common/ChatBox";
import { MessageContext } from "../contexts/MessageContext";

function CoopPage(props) {
  const { question } = useContext(QuestionContext);
  const { match } = useContext(MatchContext);
  const { code, setCode } = useContext(CodeContext);
  const { message, setMessage } = useContext(MessageContext);
  const [hide, setHide] = useState(true);
  const [chatHeight, setChatHeight] = useState(5);
  const editorRef = useRef(null);
  const monacoRef = useRef(null);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
    monacoRef.current = monaco;
  }

  function showValue() {
    console.log(editorRef.current.getPosition()); //get current position useful to show peer where you are currently at
  }
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
        user: "me", //change to username
        data: e.target.value,
      });
      setMessage(currentMessage);
      socket.emit("room-message", match, {
        user: "edwin", //change to username
        data: e.target.value,
      });
    }
  }
  useEffect(() => {
    socket.emit("code-changes", match, code);
  }, [code]);

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
              language="javascript"
              theme="vs-dark"
              value={code}
              onChange={(e) => {
                console.log("code change", e);
              }}
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
              <Button variant="contained" onClick={onShow}>
                Show
              </Button>
            )}
            {!hide && (
              <>
                <Button variant="contained" onClick={onHide}>
                  Hide
                </Button>
                <div className="chat-message-container">
                  <ChatBox />
                </div>
                <TextField
                  fullWidth
                  size="small"
                  onKeyDown={onSubmitChat}
                ></TextField>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default CoopPage;
