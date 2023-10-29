import { Box, IconButton, Modal, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { memo } from "react";
import { marked } from "marked";
import HTMLReactParser from "html-react-parser";

function SolutionPopup(props) {
	const { open, handleClose, solution } = props;
	const html = marked.parse(solution?.content);

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
					bgcolor: "background.paper",
					border: "2px solid #000",
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
					<div>{solution?.user}'s Solution</div>
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
						height: "100%",
					}}
				>
					<Box
						sx={{
							flex: 3,
							overflow: "scroll",
						}}
					>
						{HTMLReactParser(html.replace(/\\n/g, "<br>"))}
					</Box>
				</Box>
			</Box>
		</Modal>
	);
}
export default memo(SolutionPopup);
