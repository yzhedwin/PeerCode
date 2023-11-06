import {
  memo,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { QuestionContext } from "../contexts/QuestionContext";
import parse from "html-react-parser";
import Editor from "@monaco-editor/react";
import { socket } from "../components/services/WebSocket";
import { MatchContext } from "../contexts/MatchContext";
import { ProblemContext } from "../contexts/ProblemContext";
import { FirebaseContext } from "../contexts/FirebaseContext";
import axios from "axios";
import ConsoleButton from "../components/common/question/ConsoleButton";
import ProblemPageTabs from "../components/common/question/ProblemPageTabs";
import SnackBar from "../components/common/SnackBar";
import { SnackBarContext } from "../contexts/SnackBarContext";
import ConsoleTabs from "../components/common/question/ConsoleTabs";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import "../css/problemPage.scss";
import {
  EDITOR_SUPPORTED_LANGUAGES,
  EDITOR_SUPPORTED_THEMES,
} from "../utils/constants";
import { defineTheme } from "../utils/helper";
import CustomSelect from "../components/common/question/CustomSelect";
import EditorOptions from "../components/common/question/EditorOptions";
var interval_id = null;
var timeout_id = null;
function ProblemPage(props) {
  const { type } = props;
  const { question } = useContext(QuestionContext);
  const { match } = useContext(MatchContext);
  const {
    message,
    aiMessage,
    code,
    language,
    snippets,
    setLanguage,
    setCode,
    setMessage,
    setAIMessage,
    setConsoleResult,
  } = useContext(ProblemContext);
  const { openSnackBar, setOpenSnackBar, sb, setSB } =
    useContext(SnackBarContext);
  const { currentUser } = useContext(FirebaseContext);
  const [hide, setHide] = useState(true);
  const [textInput, setTextInput] = useState("");
  const [aiTextInput, setAITextInput] = useState("");
  const [aiLoading, setAILoading] = useState(false);
  const [chatHeight, setChatHeight] = useState(5);
  const [editorTheme, setEditorTheme] = useState({
    name: "vs-dark",
    value: "vs-dark",
    key: "vs-dark",
  });
  const [defaultTestCases, setDefaultTestCases] = useState([]);
  const [stdin, setStdin] = useState();
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const handleEditorDidMount = useCallback(
    (editor, monaco) => {
      editorRef.current = editor;
      monacoRef.current = monaco;
      try {
        editorRef.current.getModel().updateOptions({ tabSize: 8 });
        setCode(
          snippets?.find((snippet) => {
            return snippet?.langSlug === language.raw;
          })?.code
        );
      } catch (e) {
        console.log(e);
      }
    },
    [snippets, language.raw]
  );

  const handleCloseSnackBar = useCallback((event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
  }, []);

  // function getCursorPos() {
  //   console.log(editorRef.current.getPosition()); //get current position useful to show peer where you are currently at
  // }
  const onHide = useCallback(() => {
    setHide(true);
    setChatHeight(5);
  }, []);
  const onShow = useCallback(() => {
    setHide(false);
    setChatHeight(40);
  }, []);

  const onSubmitChat = useCallback(
    (e) => {
      if (e.keyCode === 13) {
        let currentMessage = [...message];
        currentMessage.push({
          user: "me",
          data: e.target.value,
        });
        console.log(currentUser);
        setMessage(currentMessage);
        socket.emit("room-message", match, {
          user: "bot", //change to username
          data: e.target.value,
        });
        setTextInput("");
      }
    },
    [message, match]
  );

  const onSubmitAIChat = useCallback(
    async (e) => {
      if (e.keyCode === 13) {
        setAILoading(true);
        let currentMessage = [...aiMessage];
        const prompt = e.target.value;
        currentMessage.push({
          role: "user",
          content: prompt,
        });
        setAIMessage(currentMessage);
        setAITextInput("AI is replying...");
        await axios
          .post("http://localhost:8020/ask", { prompt })
          .then((res) => {
            let result = res.data;
            for (var i = 0; i < 2; i++) {
              result = result.replace("\n", "");
            }
            currentMessage.push({
              role: "system",
              content: result,
            });
          })
          .catch((error) => console.log(error));

        // Below is the "correct" implementation with chat persistence. However, it is very slow,
        // even when using the Turbo model. Hence, the initial implementation without chat persistence
        // might be more practical.

        // await axios
        //   .post("http://localhost:8020/chat", { currentMessage })
        //   .then((res) => {
        //     let result = res.data.content;
        //     for (var i = 0; i < 2; i++) {
        //       result = result.replace("\n", "");
        //     }
        //     currentMessage.push({
        //       role: "system",
        //       content: result,
        //     });
        //   })
        //   .catch((error) => console.log(error));
        setAIMessage(currentMessage);
        setAITextInput("");
        setAILoading(false);
      }
    },
    [aiMessage]
  );

  const getSubmission = useCallback((token) => {
    interval_id = setInterval(async () => {
      const { data } = await axios.get(
        `http://localhost:5000/api/v1/judge/submission?token=${token}`
      );
      if (data.status.id !== 1 && data.status.id !== 2) {
        clearInterval(interval_id);
        clearTimeout(timeout_id);
        const feedback = {
          stdout: data.stdout ? atob(data.stdout) : "None",
          time: data.time,
          memory: data.memory,
          stderr: data.stderr ? atob(data.stderr) : "None",
          compile_output: data.compile_output
            ? atob(data.compile_output)
            : "None",
          message: data.message ? atob(data.message) : "None",
          status: data.status,
        };
        if (type === "coop") {
          socket.emit("code-submission", match, feedback);
        }
        setConsoleResult(feedback);
        setIsRunning(false);
        setSB({ msg: "Code Submitted", severity: "success" });
        setOpenSnackBar(true);
      }
    }, 2000);
  }, []);

  const getSubmissionAndSubmit = useCallback((token) => {
    timeout_id = setTimeout(() => {
      clearInterval(interval_id);
      setSB({ msg: "Submission timedout", severity: "error" });
      setOpenSnackBar(true);
      setIsSubmitting(false);
    }, 10000);
    interval_id = setInterval(async () => {
      const { data } = await axios.get(
        `http://localhost:5000/api/v1/judge/submission?token=${token}`
      );
      if (data.status.id !== 1 && data.status.id !== 2) {
        clearInterval(interval_id);
        clearTimeout(timeout_id);
        const feedback = {
          stdout: data.stdout ? atob(data.stdout) : "None",
          time: data.time,
          memory: data.memory,
          stderr: data.stderr ? atob(data.stderr) : "None",
          compile_output: data.compile_output
            ? atob(data.compile_output)
            : "None",
          message: data.message ? atob(data.message) : "None",
          status: data.status,
        };
        if (type === "coop") {
          socket.emit("code-submission", match, feedback);
        }
        setConsoleResult(feedback);
        setIsSubmitting(false);
        setSB({ msg: "Code Submitted", severity: "success" });
        setOpenSnackBar(true);
        await axios.post(`http://localhost:5000/api/v1/question/history`, {
          submission: {
            userID: "1234",
            titleSlug: question["titleSlug"],
            language_id: language.id,
            source_code: code,
          },
          feedback: data,
        });
      }
    }, 2000);
  }, []);

  const onSubmit = async () => {
    //save to db
    console.log("submit, run against all test cases");
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/v1/judge/submission",
        {
          userID: "1234",
          titleSlug: question["titleSlug"],
          language_id: language.id,
          source_code: btoa(code),
          stdin: btoa(JSON.stringify(stdin)),
        }
      );
      setIsSubmitting(true);
      timeout_id = setTimeout(() => {
        clearInterval(interval_id);
        setSB({ msg: "Submission timedout", severity: "error" });
        setOpenSnackBar(true);
        setIsSubmitting(false);
      }, 10000);
      getSubmissionAndSubmit(data.token);
    } catch (e) {
      console.log(e.message);
    }
  };
  const onRun = useCallback(async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/v1/judge/submission",
        {
          userID: "1234",
          titleSlug: question["titleSlug"],
          language_id: language.id,
          source_code: btoa(code),
          stdin: btoa(JSON.stringify(stdin)),
        }
      );
      setIsRunning(true);
      timeout_id = setTimeout(() => {
        clearInterval(interval_id);
        setSB({ msg: "Submission timedout", severity: "error" });
        setOpenSnackBar(true);
        setIsRunning(false);
      }, 10000);
      getSubmission(data.token);
    } catch (e) {
      console.log(e.message);
    }
  }, [code, match, question, language.id, type, stdin]);

  const handleLanguageChange = useCallback(
    (event) => {
      setLanguage(JSON.parse(event.target.value));
      if (type === "coop") {
        socket.emit("code-language", match, event.target.value);
      }
      setCode(
        snippets?.find((snippet) => {
          return snippet.langSlug === JSON.parse(event.target.value).raw;
        })?.code
      );
    },
    [type, match, snippets]
  );
  const handleThemeChange = useCallback((event) => {
    const theme = JSON.parse(event.target.value);
    if (["light", "vs-dark"].includes(theme.name)) {
      setEditorTheme(theme);
    } else {
      defineTheme(theme.value).then((_) => setEditorTheme(theme));
    }
  }, []);

  const handleCodeChanges = useCallback(
    (code) => {
      setCode(code);
      if (type === "coop") {
        socket.emit("code-changes", match, code);
      }
    },
    [match, type]
  );

  const handleLeaveRoom = useCallback(() => {
    if (type === "coop") {
      socket.emit("match-quit", match);
      setSB({ msg: "Requested to quit session...", severity: "success" });
      setOpenSnackBar(true);
    }
  }, [match, type]);

  const getDefaultTestCases = async () => {
    const { data } = await axios.get(
      `http://localhost:5000/api/v1/question/exampletestcase`,
      {
        params: { titleSlug: question?.titleSlug },
      }
    );
    const testcases = data?.testCases?.map((tc) => {
      const arr = tc.split("\n").map((param, index) => {
        return {
          [JSON.parse(data.metaData).params[index].name]: param,
        };
      });
      return Object.assign(...arr);
    });
    setDefaultTestCases(testcases);
  };
  useEffect(() => {
    //get Test case here once
    setMessage([]);
    setAIMessage([]);
    getDefaultTestCases();
    return () => {
      clearInterval(interval_id);
      clearTimeout(timeout_id);
    };
  }, []);
  return (
    <>
      <SnackBar
        msg={sb?.msg}
        handleCloseSnackBar={handleCloseSnackBar}
        openSnackBar={openSnackBar}
        severity={sb?.severity}
      />
      <div className="problem-page-container">
        <div className="problem-tabs-container">
          <ProblemPageTabs
            userID={"1234"}
            titleSlug={question?.titleSlug}
            description={parse(
              typeof question?.problem === "string"
                ? question.problem
                : "Failed to load"
            )}
          />
        </div>
        <div className="editor-container">
          <EditorOptions
            language={language}
            editorTheme={editorTheme}
            handleLanguageChange={handleLanguageChange}
            handleThemeChange={handleThemeChange}
          />
          <div
            className="editor-component"
            style={{ height: `${100 - chatHeight}%` }}
          >
            <Editor
              height="100%"
              language={language?.raw}
              theme={editorTheme?.value}
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

          {!hide && (
            <div
              className="console-tabs-container"
              style={{ height: `${chatHeight}%` }}
            >
              <ConsoleTabs
                onSubmitChat={onSubmitChat}
                onSubmitAIChat={onSubmitAIChat}
                setTextInput={setTextInput}
                setAITextInput={!aiLoading && setAITextInput}
                textInput={textInput}
                aiTextInput={aiTextInput}
                chatDisabled={type !== "coop"}
                defaultTestCases={defaultTestCases}
                setStdin={setStdin}
              />
            </div>
          )}
          <div className="console-options">
            {hide ? (
              <ConsoleButton
                onClick={onShow}
                icon={<KeyboardArrowUpIcon />}
                title={"Console"}
              />
            ) : (
              <ConsoleButton
                icon={<KeyboardArrowDownIcon />}
                onClick={onHide}
                title={"Console"}
              />
            )}
            {type === "coop" && (
              <ConsoleButton
                title={"Leave"}
                onClick={handleLeaveRoom}
                sx={{ marginLeft: "auto", mr: 1 }}
              />
            )}
            <ConsoleButton
              onClick={onRun}
              title={"Run"}
              loading={isRunning ? isRunning : undefined}
              disabled={isSubmitting}
              sx={{ marginLeft: "auto", mr: 1 }}
            />
            <ConsoleButton
              onClick={onSubmit}
              title={"Submit"}
              loading={isSubmitting ? isSubmitting : undefined}
              disabled={isRunning}
              sx={{ backgroundColor: "green" }}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default memo(ProblemPage);
