import { useContext, useEffect, useRef, useState } from "react";
import { QuestionContext } from "../contexts/QuestionContext";
import parse from "html-react-parser";
import Editor from "@monaco-editor/react";
import { Button, TextField } from "@mui/material";
import ChatBox from "../components/common/ChatBox";
function ProblemPage(props) {
  const { question } = useContext(QuestionContext);
  const [code, setCode] = useState("console.log('hello world')");
  const [hide, setHide] = useState(true);
  const [chatHeight, setChatHeight] = useState(5);
  const editorRef = useRef(null);
  const monacoRef = useRef(null);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
    monacoRef.current = monaco;
  }

  // function showValue() {
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
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ProblemPage;
