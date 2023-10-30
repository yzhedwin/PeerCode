import HTMLReactParser from "html-react-parser";
import { EDITOR_SUPPORTED_LANGUAGES } from "../../utils/constants";
import { memo, useEffect, useRef, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { marked } from "marked";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

function SolutionCode(props) {
	const { snippetsIndex, description } = props;
	const [refresh, setRefresh] = useState(1);
	let ref = useRef([]);
	let solutions = [];
	let solutionIndex = 0;
	solutions[solutionIndex] = [];
	snippetsIndex.forEach((_, index) => {
		let snippet = description
			.substring(snippetsIndex[index] + 3, snippetsIndex[index + 1])
			.trim();
		if (snippet.startsWith("#")) {
			solutionIndex++;
			solutions[solutionIndex] = [snippet];
		} else if (
			snippet
				.substring(snippet.indexOf("]") + 1)
				.trim()
				.startsWith("class")
		) {
			snippet = {
				language: EDITOR_SUPPORTED_LANGUAGES.find((lang) => {
					return lang.name.includes(
						snippet.substring(0, snippet.indexOf("[")).trim()
					);
				}),
				code: snippet.substring(snippet.indexOf("]") + 1),
			};
			solutions[solutionIndex].push(snippet);
		}
	});
	const titles = solutions.map((solution) => {
		if (typeof solution[0] === "string" && solution[0].startsWith("#")) {
			const header = solution[0];
			solution.splice(0, 1);
			return header;
		}
	});

	//TODO: let user select which language instead of cycling
	const codes = solutions.map((solution, index) => {
		ref.current.push(0);
		return (
			<>
				<div
					style={{ cursor: "pointer" }}
					onClick={() => {
						if (ref.current[index] >= codes.length - 1) {
							ref.current[index] = 0;
						} else {
							ref.current[index] += 1;
						}
						setRefresh((prevState) => prevState * -1);
						console.log(ref.current[index]);
					}}
				>
					{solution[ref.current[index]].language.name}
				</div>
				<SyntaxHighlighter
					style={vscDarkPlus}
					language={solution[ref.current[index]].language.raw}
				>
					{solution[ref.current[index]].code}
				</SyntaxHighlighter>
			</>
		);
	});
	return (
		<>
			{codes[0]}
			{titles.map((title, index) => {
				if (index + 1 < titles.length) {
					return (
						<>
							{HTMLReactParser(marked.parse(titles[index + 1]))}
							{codes[index + 1]}
						</>
					);
				}
			})}
		</>
	);
}

export default memo(SolutionCode);
