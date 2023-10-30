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
import { socket } from "../components/common/WebSocket";
import { MatchContext } from "../contexts/MatchContext";
import { ProblemContext } from "../contexts/ProblemContext";
import axios from "axios";
import SelectLanguage from "../components/common/SelectLanguage";
import ConsoleButton from "../components/common/ConsoleButton";
import ProblemPageTabs from "../components/common/ProblemPageTabs";
import SnackBar from "../components/common/SnackBar";
import { SnackBarContext } from "../contexts/SnackBarContext";
import ConsoleTabs from "../components/common/ConsoleTabs";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
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
	const [chatHeight, setChatHeight] = useState(5);
	const [testCase, setTestCase] = useState([]);
	const editorRef = useRef(null);
	const monacoRef = useRef(null);

	const handleEditorDidMount = useCallback(
		(editor, monaco) => {
			editorRef.current = editor;
			monacoRef.current = monaco;
			setCode(
				snippets?.find((snippet) => {
					return snippet.langSlug === language.raw;
				})?.code
			);
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
		setChatHeight(30);
	}, []);

	const onSubmitChat = useCallback(
		(e) => {
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
				setTextInput("");
			}
		},
		[message, match]
	);
	const onRun = useCallback(async () => {
		try {
			const r1 = await axios.post(
				"http://localhost:5000/api/v1/judge/submission",
				{
					userID: "1234",
					titleSlug: question["titleSlug"],
					language_id: language.id,
					source_code: code,
				}
			);
			const { data } = await axios.get(
				`http://localhost:5000/api/v1/judge/submission?token=${r1.data.token}`
			);
			if (type === "coop") {
				socket.emit("code-submission", match, {
					stdout: data.stdout ? atob(data.stdout) : "None",
					time: data.time,
					memory: data.memory,
					stderr: data.stderr ? atob(data.stderr) : "None",
					compile_output: data.compile_output,
					message: data.message ? atob(data.message) : "None",
					status: data.status,
				});
			}
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
	}, [code, match, question, language.id, type]);

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

	const getTestCase = async () => {
		const { data } = await axios.get(
			`http://localhost:5000/api/v1/question/exampletestcase`,
			{ params: { titleSlug: question?.titleSlug } }
		);
		setTestCase(data);
	};
	useEffect(() => {
		console.log("problem page");
		//get Test case here once
		getTestCase();
	}, []);

	return (
		<>
			<SnackBar
				msg={sb.msg}
				handleCloseSnackBar={handleCloseSnackBar}
				openSnackBar={openSnackBar}
				severity={sb.severity}
			/>
			<div className="problem-page-container">
				<div className="problem-description-container">
					<ProblemPageTabs
						userID={"1234"}
						titleSlug={question["titleSlug"]}
						description={parse(question["problem"])}
					/>
				</div>

				<div className="editor-container">
					<div>
						<SelectLanguage
							language={language}
							handleChange={handleLanguageChange}
						/>
					</div>
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

					{!hide && (
						<div
							className="console-tabs-container"
							style={{ height: `${chatHeight}%` }}
						>
							<ConsoleTabs
								onSubmitChat={onSubmitChat}
								setTextInput={setTextInput}
								textInput={textInput}
								chatDisabled={type !== "coop"}
								testCase={testCase}
							/>
						</div>
					)}
					<div className="console-options">
						{hide ? (
							<ConsoleButton
								onClick={onShow}
								icon={<KeyboardArrowUpIcon />}
								title={"Console"}
								sx={{ marginInline: 1 }}
							/>
						) : (
							<ConsoleButton
								icon={<KeyboardArrowDownIcon />}
								onClick={onHide}
								title={"Console"}
								sx={{ marginInline: 1 }}
							/>
						)}
						{type === "coop" && (
							<ConsoleButton
								title={"Leave"}
								onClick={handleLeaveRoom}
								sx={{ marginLeft: "auto", mr: 1 }}
							/>
						)}
						<ConsoleButton onClick={onRun} title={"Run"} />
					</div>
				</div>
			</div>
		</>
	);
}

export default memo(ProblemPage);
