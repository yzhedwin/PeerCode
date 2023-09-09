import { useContext, useEffect, useRef, useState } from "react";
import { QuestionContext } from "../contexts/QuestionContext";
import parse from "html-react-parser";
import Editor from "@monaco-editor/react";
import { Button } from "@mui/material";
function ProblemPage(props) {
  const { question } = useContext(QuestionContext);
  const [code, setCode] = useState("console.log('hello world')");
  const editorRef = useRef(null);
  const monacoRef = useRef(null);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
    monacoRef.current = monaco;
  }

  function showValue() {
    console.log(editorRef.current.getPosition()); //get current position useful to show peer where you are currently at
  }
  return (
    <>
      <div className="problem-page-container">
        <div className="problem-description-container">
          {parse(question["problem"])}
        </div>
        <div className="editor-container">
          <Editor
            height="70%"
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
          {/*FOR DEBUG*/}

          <div className="console-and-chat-container">
            <Button variant="contained" onClick={showValue}>
              Show
            </Button>
            CHAT+CONSOLE
          </div>
        </div>
      </div>
    </>
  );
}

export default ProblemPage;
