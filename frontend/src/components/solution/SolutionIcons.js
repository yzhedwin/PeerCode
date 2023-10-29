import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { Box } from "@mui/material";

export default function SolutionIcons(props) {
	const { vote, view, comment } = props;
	let formatter = Intl.NumberFormat("en", { notation: "compact" });
	return (
		<div className="solution-icon">
			<Box
				sx={{
					display: "flex",
					mr: 1,
					alignItems: "center",
				}}
			>
				<ArrowUpwardIcon fontSize="small" sx={{ mr: 0.25 }} />
				<span>{formatter.format(vote)}</span>
			</Box>

			<Box sx={{ display: "flex", mr: 1, alignItems: "center" }}>
				<VisibilityOutlinedIcon fontSize="small" sx={{ mr: 0.25 }} />
				<span>{formatter.format(view)}</span>
			</Box>

			<Box sx={{ display: "flex", alignItems: "center" }}>
				<ChatBubbleOutlineOutlinedIcon
					fontSize="small"
					sx={{ mr: 0.25 }}
				/>
				<span>{formatter.format(comment)}</span>
			</Box>
		</div>
	);
}
