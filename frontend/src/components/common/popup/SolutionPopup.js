import { Box, IconButton, Modal, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { memo } from "react";
import { marked } from "marked";
import HTMLReactParser from "html-react-parser";
import SolutionCode from "../../solution/SolutionCode";
import SolutionItem from "../../solution/SolutionItem";
import { EDITOR_SUPPORTED_LANGUAGES } from "../../../utils/constants";

function SolutionPopup(props) {
	const { open, handleClose, solution } = props;
	const description = solution?.content?.replaceAll("\\n", "\n");
	const introduction = description?.split("```")[0];
	let codeLanguages = [];
	const c = solution.solutionTags.map((tag) => {
		return EDITOR_SUPPORTED_LANGUAGES.find(
			(lang) => lang.raw === tag.slug || lang.name === tag.name
		)?.name;
	});
	c.forEach((c) => c && codeLanguages.push(c));
	return (
		<Modal
			open={open}
			onClose={handleClose}
			aria-labelledby="modal-modal-title"
			aria-describedby="modal-modal-description"
		>
			<Box
				style={{
					position: "absolute",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					width: "70%",
					height: "70%",
					boxShadow: 24,
					p: 4,
				}}
			>
				<Typography
					id="modal-modal-title"
					variant="h6"
					component="h2"
					textAlign={"center"}
					sx={{
						backgroundColor: "secondary.main",
						color: "secondary.contrastText",
					}}
				>
					<IconButton
						style={{
							position: "absolute",
							right: 0,
							top: 0,
						}}
						onClick={handleClose}
					>
						<CloseIcon fontSize="small" />
					</IconButton>
				</Typography>
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						backgroundColor: "primary.main",
						color: "primary.contrastText",
						height: "100%",
						borderRadius: 5,
						padding: 1,
					}}
				>
					<Box
						sx={{
							flex: 3,
							overflow: "auto",
							borderRadius: 5,
						}}
					>
						<SolutionItem item={solution} />
						<div style={{ padding: "10px" }}>
							{HTMLReactParser(marked.parse(introduction))}
						</div>
						<div style={{ padding: "10px" }}>
							<SolutionCode description={description} codeLanguages={codeLanguages} />
						</div>
					</Box>
				</Box>
			</Box>
		</Modal>
	);
}
export default memo(SolutionPopup);
