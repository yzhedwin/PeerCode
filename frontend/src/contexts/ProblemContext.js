import React, { createContext, useState } from "react";

export const ProblemContext = createContext();

export const ProblemProvider = ({ children }) => {
	const [message, setMessage] = useState([]);
	const [code, setCode] = useState("console.log('hello world')");
	const [snippets, setSnippets] = useState([]);
	const [consoleResult, setConsoleResult] = useState({});
	const [language, setLanguage] = useState({
		id: 63,
		name: "JavaScript (Node.js 12.14.0)",
		raw: "javascript",
	});
	return (
		<ProblemContext.Provider
			value={{
				message,
				language,
				code,
				consoleResult,
				snippets,
				setMessage,
				setLanguage,
				setCode,
				setConsoleResult,
				setSnippets,
			}}
		>
			{children}
		</ProblemContext.Provider>
	);
};
