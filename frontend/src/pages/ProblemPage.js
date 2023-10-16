import { useContext, useRef, useState } from "react";
import { QuestionContext } from "../contexts/QuestionContext";
import parse from "html-react-parser";
import Editor from "@monaco-editor/react";
import { TextField } from "@mui/material";
import { socket } from "../components/common/WebSocket";
import { MatchContext } from "../contexts/MatchContext";
import ChatBox from "../components/common/ChatBox";
import { ProblemContext } from "../contexts/ProblemContext";
import axios from "axios";
import SelectLanguage from "../components/common/SelectLanguage";
import Console from "../components/common/Console";
import ConsoleButton from "../components/common/ConsoleButton";
import ProblemPageTabs from "../components/common/ProblemPageTabs";
import SnackBar from "../components/common/SnackBar";
import { SnackBarContext } from "../contexts/SnackBarContext";

function ProblemPage(props) {
	const { type } = props;
	const { question } = useContext(QuestionContext);
	const { match } = useContext(MatchContext);
	const {
		message,
		code,
		language,
		setLanguage,
		setCode,
		setMessage,
		setConsoleResult,
	} = useContext(ProblemContext);
	const { openSnackBar, setOpenSnackBar, sb, setSB } =
		useContext(SnackBarContext);
	const [hide, setHide] = useState(true);
	const [description, setDescription] = useState(true);
	const [showConsole, setShowConsole] = useState(type === "solo");
	const [chatHeight, setChatHeight] = useState(5);
	const [textInput, setTextInput] = useState("");
	const editorRef = useRef(null);
	const monacoRef = useRef(null);

	function handleEditorDidMount(editor, monaco) {
		editorRef.current = editor;
		monacoRef.current = monaco;
	}

	const handleCloseSnackBar = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}
		setOpenSnackBar(false);
	};

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
			setTextInput("");
		}
	}
	const onRun = async () => {
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
	};
	function handleLanguageChange(event) {
		setLanguage(JSON.parse(event.target.value));
		if (type === "coop") {
			socket.emit("code-language", match, event.target.value);
		}
	}
	function handleCodeChanges(code) {
		setCode(code);
		if (type === "coop") {
			socket.emit("code-changes", match, code);
		}
	}
	function handleLeaveRoom() {
		if (type === "coop") {
			socket.emit("match-quit", match);
			setSB({ msg: "Requested to quit session...", severity: "success" });
			setOpenSnackBar(true);
		}
	}

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
						{hide && <ConsoleButton onClick={onShow} title={"Show"} />}
						{!hide && (
							<>
								<div className="console-options">
									<ConsoleButton
										onClick={onHide}
										title={"Hide"}
										sx={{ marginInline: 1 }}
									/>

									{!showConsole ? (
										<ConsoleButton onClick={setShowConsole} title={"Console"} />
									) : (
										<ConsoleButton
											onClick={() => setShowConsole(false)}
											title={"Chat"}
											disabled={type === "solo"}
										/>
									)}
									<SelectLanguage
										language={language}
										handleChange={handleLanguageChange}
									/>
									<ConsoleButton
										title={"Leave"}
										onClick={handleLeaveRoom}
										sx={{ marginLeft: "auto", mr: 1 }}
									/>
								</div>
								{showConsole ? (
									<Console onRun={onRun} />
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
												onChange={(e) => {
													setTextInput(e.target.value);
												}}
												value={textInput}
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

export default ProblemPage;
