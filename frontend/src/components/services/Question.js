import { useCallback, useContext, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
import axios from "axios";
import { QuestionContext } from "../../contexts/QuestionContext";
import { useNavigate } from "react-router-dom";
import { SnackBarContext } from "../../contexts/SnackBarContext";
import { ProblemContext } from "../../contexts/ProblemContext";

function Question() {
	const navigate = useNavigate();
	const { setSnippets } = useContext(ProblemContext);
	const { setQuestion } = useContext(QuestionContext);
	const { setSB, setOpenSnackBar } = useContext(SnackBarContext);
	const gridRef = useRef(); // Optional - for accessing Grid's API
	const [rowData, setRowData] = useState(); // Set rowData to Array of Objects, one Object per Row
	// Each Column Definition results in one Column.
	const columnDefs = useMemo(
		() => [
			{ headerName: "No.", valueGetter: "node.id" },
			{ field: "title", headerName: "Title" },
			{
				headerName: "Tags",
				valueGetter: (params) => {
					if (Array.isArray(params.data.topicTags)) {
						return params.data.topicTags
							.map((tag) => tag.name)
							.join(", ");
					}
					return "";
				},
				filter: true,
				filterParams: {},
			},
			{
				field: "difficulty",
				headerName: "Difficulty",
				filter: true,
				filterParams: {},
			},
			{
				field: "status",
				headerName: "Status",
				filter: true,
				filterParams: {},
			},
		],
		[]
	);

	// DefaultColDef sets props common to all Columns
	const defaultColDef = useMemo(
		() => ({
			flex: 1,
		}),
		[]
	);
	const rowClass = "question-not-completed";

	// all even rows assigned 'my-shaded-effect'
	const getRowClass = (params) => {
		if (params.node.data.status === "Completed") {
			return "question-completed";
		} else if (params.node.data.status === "Attempted") {
			return "question-inprogress";
		}
	};

	const cellClickedListener = useCallback(async (event) => {
		try {
			const [question, snippets] = await Promise.all([
				await axios.get(
					`http://localhost:5000/api/v1/question/problem?titleSlug=${event.data["titleSlug"]}`
				),
				await axios.get(
					`http://localhost:5000/api/v1/question/codesnippets?titleSlug=${event.data["titleSlug"]}`
				),
			]);
			setQuestion({
				titleSlug: event.data["titleSlug"],
				problem: question["data"],
			});
			setSnippets(snippets["data"]);
			navigate("/problem");
		} catch (e) {
			setSB({ msg: `Question Service: ${e.message}`, severity: "error" });
			setOpenSnackBar(true);
		}
	}, []);

	const onGridReady = useCallback(async (params) => {
		try {
			const { data } = await axios.get(
				"http://localhost:5000/api/v1/question"
			);
			setRowData(data);
		} catch (e) {
			setSB({ msg: `Question Service: ${e.message}`, severity: "error" });
			setOpenSnackBar(true);
		}
	}, []);

	return (
		<div className="question-container">
			<div
				className="ag-theme-alpine"
				style={{ width: "100%", height: "100%" }}
			>
				<AgGridReact
					ref={gridRef} // Ref for accessing Grid's API
					rowData={rowData} // Row Data for Rows
					columnDefs={columnDefs} // Column Defs for Columns
					defaultColDef={defaultColDef} // Default Column Properties
					animateRows={true} // Optional - set to 'true' to have rows animate when sorted
					rowSelection="single" // Options - allows click selection of rows
					onCellClicked={cellClickedListener} // Optional - registering for Grid Event
					rowClass={rowClass}
					getRowClass={getRowClass}
					pagination={true}
					paginationAutoPageSize={true}
					onGridReady={onGridReady}
				/>
			</div>
		</div>
	);
}

export default Question;
