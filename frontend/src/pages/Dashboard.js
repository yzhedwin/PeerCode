import SnackBar from "../components/common/SnackBar";
import Match from "../components/services/Match";
import Question from "../components/services/Question";
import QuestionOTD from "../components/services/QuestionOTD";
import { SnackBarContext } from "../contexts/SnackBarContext";
import { useContext } from "react";

export default function Dashboard() {
	const { openSnackBar, setOpenSnackBar, sb } = useContext(SnackBarContext);

	const handleCloseSnackBar = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}
		setOpenSnackBar(false);
	};
	return (
		<>
			<SnackBar
				msg={sb.msg}
				handleCloseSnackBar={handleCloseSnackBar}
				openSnackBar={openSnackBar}
				severity={sb.severity}
			/>
			<div className="dashboard-container">
				<div className="dashboard-container-top">
					<QuestionOTD />
					<Match />
				</div>
				<Question />
			</div>
		</>
	);
}
