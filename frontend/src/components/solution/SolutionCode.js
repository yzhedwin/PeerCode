import HTMLReactParser from "html-react-parser";
import { EDITOR_SUPPORTED_LANGUAGES } from "../../utils/constants";
import { memo, useEffect, useRef, useState, useCallback } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { marked } from "marked";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Chip } from "@mui/material";
import detectLang from "lang-detector";

function SolutionCode(props) {
	const { description, codeLanguages } = props;
	const [solutions, setSolutions] = useState([]);
	const [selectLanguage, setSelectLanguage] = useState();
	let snippetsIndex = [];
	for (let i = 0; i < description.length; i++) {
		if (description.substring(i, i + 3) === "```") {
			snippetsIndex.push(i);
			i += 2;
		}
	}

	const groupBySolution = useCallback(() => {
		let solutions = [];
		let solutionIndex = 0;
		solutions.push({});
		let count = codeLanguages.length;
		snippetsIndex.forEach((_, index) => {
			let snippet = description.substring(snippetsIndex[index] + 3, snippetsIndex[index + 1]);
			if (snippet.includes("class")) {
				snippet = snippet.substring(snippet.indexOf("class"));
				solutions[solutionIndex][detectLang(snippet)] = snippet;
				count--;
			}
			if (count < 1) {
				count = codeLanguages.length;
				solutionIndex += 1;
				if (solutionIndex < codeLanguages.length) {
					solutions.push({});
				}
			}
		});
		let selectLanguage = [];
		solutions.forEach((solution) => {
			selectLanguage.push(Object.keys(solution)[0]);
		});
		setSelectLanguage(selectLanguage);
		setSolutions(solutions);
	}, []);

	useEffect(() => {
		groupBySolution();
	}, []);

	const ProcessCodeBlock = () => {
		let solutionIndex = -1;
		let count = codeLanguages.length;
		return snippetsIndex.map((_, index) => {
			const snippet = description.substring(
				snippetsIndex[index] + 3,
				snippetsIndex[index + 1]
			);
			if (snippet.includes("class")) {
				if (count === 1) {
					solutionIndex += 1;
					count = codeLanguages.length;
					if (solutions[solutionIndex]) {
						return (
							<>
								{Object.keys(solutions[solutionIndex]).map((key) => {
									return (
										<Chip
											label={
												<span
													id={solutionIndex}
													title={`Solution ${solutionIndex}`}
												>
													{key}
												</span>
											}
											size="small"
											sx={{
												ml: 1,
												color: "black",
											}}
											onClick={(e) => {
												let id;
												e.target.id
													? (id = e.target.id)
													: (id = e.target.firstChild.id);
												let newLanguage = [...selectLanguage];
												newLanguage[id] = key;
												setSelectLanguage(newLanguage);
											}}
										/>
									);
								})}
								<SyntaxHighlighter
									style={vscDarkPlus}
									language={
										EDITOR_SUPPORTED_LANGUAGES.find((lang) => {
											return lang.name.includes(detectLang(snippet));
										})?.raw
									}
								>
									{solutions[solutionIndex][selectLanguage[solutionIndex]]}
								</SyntaxHighlighter>
							</>
						);
					}
				}
				count -= 1;
			} else {
				return HTMLReactParser(marked.parse(snippet));
			}
		});
	};

	return <ProcessCodeBlock />;
}

export default SolutionCode;
