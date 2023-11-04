import {
    memo,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import { QuestionContext } from "../contexts/QuestionContext";
import Editor from "@monaco-editor/react";
import { socket } from "../components/services/WebSocket";
import { MatchContext } from "../contexts/MatchContext";
import { ProblemContext } from "../contexts/ProblemContext";
import axios from "axios";
import ConsoleButton from "../components/common/question/ConsoleButton";
import ProblemPageTabs from "../components/common/question/ProblemPageTabs";
import SnackBar from "../components/common/SnackBar";
import { SnackBarContext } from "../contexts/SnackBarContext";
import ConsoleTabs from "../components/common/question/ConsoleTabs";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import "../css/problemPage.scss";
import { defineTheme } from "../utils/helper";
import EditorOptions from "../components/common/question/EditorOptions";
import ResizeBar from "../components/common/ResizeBar";
var interval_id = null;
var timeout_id = null;
function ProblemPage(props) {
    const { type } = props;
    const { question } = useContext(QuestionContext);
    const { match } = useContext(MatchContext);
    const {
        message,
        code,
        language,
        snippets,
        setLanguage,
        setCode,
        setMessage,
        setConsoleResult,
    } = useContext(ProblemContext);
    const { openSnackBar, setOpenSnackBar, sb, setSB } =
        useContext(SnackBarContext);
    const [hide, setHide] = useState(true);
    const [textInput, setTextInput] = useState("");
    const [chatHeight, setChatHeight] = useState(100);
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
    const containerRef = useRef(null);

    const handleEditorDidMount = useCallback(
        (editor, monaco) => {
            editorRef.current = editor;
            monacoRef.current = monaco;
            try {
                editorRef.current.getModel().updateOptions({
                    tabSize: 8,
                });

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
        setChatHeight(100);
    }, []);
    const onShow = useCallback(() => {
        setHide(false);
        setChatHeight(60);
    }, []);

    const onSubmitChat = useCallback(
        (e) => {
            if (e.keyCode === 13) {
                let date = new Date();
                const time = `${date.getHours()}:${String(
                    date.getMinutes()
                ).padStart(2, "0")}`;
                let currentMessage = [...message];
                currentMessage.push({
                    user: "me",
                    data: e.target.value,
                    time: time,
                });
                setMessage(currentMessage);
                socket.emit("room-message", match, {
                    user: "edwin", //change to username
                    data: e.target.value,
                    time: time,
                });
                setTextInput("");
            }
        },
        [message, match]
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
                await axios.post(
                    `http://localhost:5000/api/v1/question/history`,
                    {
                        submission: {
                            userID: "1234",
                            titleSlug: question["titleSlug"],
                            language_id: language.id,
                            source_code: code,
                        },
                        feedback: data,
                    }
                );
            }
        }, 2000);
    }, []);

    const onSubmit = async () => {
        //save to db
        try {
            const { data } = await axios.post(
                "http://localhost:5000/api/v1/judge/submission",
                {
                    userID: "1234",
                    titleSlug: question["titleSlug"],
                    language_id: language.id,
                    source_code: btoa(code),
                    stdin: btoa(
                        stdin
                            ? JSON.stringify(stdin)
                            : JSON.stringify(defaultTestCases[0])
                    ),
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
                    stdin: btoa(
                        stdin
                            ? JSON.stringify(stdin)
                            : JSON.stringify(defaultTestCases[0])
                    ),
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
    }, [code, match, question, language.id, type, stdin, defaultTestCases]);

    const handleLanguageChange = useCallback(
        (event) => {
            setLanguage(JSON.parse(event.target.value));
            if (type === "coop") {
                socket.emit("code-language", match, event.target.value);
            }
            setCode(
                snippets?.find((snippet) => {
                    return (
                        snippet.langSlug === JSON.parse(event.target.value).raw
                    );
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
        getDefaultTestCases();
        return () => {
            clearInterval(interval_id);
            clearTimeout(timeout_id);
        };
    }, []);
    useEffect(() => {
        console.log("height", chatHeight);
    }, [chatHeight]);

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
                    <ProblemPageTabs userID={"1234"} question={question} />
                </div>
                <div className="editor-container" ref={containerRef}>
                    <EditorOptions
                        language={language}
                        editorTheme={editorTheme}
                        handleLanguageChange={handleLanguageChange}
                        handleThemeChange={handleThemeChange}
                    >
                        {type === "coop" && (
                            <ConsoleButton
                                title={"Leave"}
                                onClick={handleLeaveRoom}
                                sx={{
                                    ml: "auto",
                                    backgroundColor: "red",
                                    mb: 1,
                                }}
                            />
                        )}
                    </EditorOptions>

                    <div
                        className="editor-component"
                        style={{ height: `${chatHeight}%` }}
                    >
                        <Editor
                            height="100%"
                            language={language?.raw}
                            theme={editorTheme?.value}
                            value={code}
                            onChange={handleCodeChanges}
                            onMount={handleEditorDidMount}
                            options={{
                                dragAndDrop: false,
                                inlineSuggest: true,
                                fontSize: "16px",
                                formatOnType: true,
                                autoClosingBrackets: true,
                                minimap: { scale: 10 },
                            }}
                        />
                    </div>
                    <ResizeBar
                        setHeight={setChatHeight}
                        containerRef={containerRef}
                    />
                    <div
                        className="console-tabs-container"
                        style={{
                            flex: 1,
                            display: hide ? "none" : "flex",
                            height: `${100 - chatHeight}%`,
                        }}
                    >
                        <ConsoleTabs
                            onSubmitChat={onSubmitChat}
                            setTextInput={setTextInput}
                            textInput={textInput}
                            chatDisabled={type !== "coop"}
                            defaultTestCases={defaultTestCases}
                            setStdin={setStdin}
                        />
                    </div>
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
                        <ConsoleButton
                            onClick={onRun}
                            title={"Run"}
                            loading={isRunning ? isRunning : undefined}
                            disabled={isSubmitting}
                            sx={{ ml: "auto", mr: 1 }}
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
