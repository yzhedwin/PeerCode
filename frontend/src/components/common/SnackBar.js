import { Alert, Snackbar } from "@mui/material";
import React from "react";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function SnackBar(props) {
	const { msg, handleCloseSnackBar, openSnackBar, severity } = props;
	const snackBarAction = (
		<React.Fragment>
			<IconButton
				size="small"
				aria-label="close"
				color="inherit"
				onClick={handleCloseSnackBar}
			>
				<CloseIcon fontSize="small" />
			</IconButton>
		</React.Fragment>
	);

	return (
		<Snackbar
			open={openSnackBar}
			autoHideDuration={5000}
			onClose={handleCloseSnackBar}
			action={snackBarAction}
			anchorOrigin={{ vertical: "top", horizontal: "center" }}
			transitionDuration={500}
		>
			<Alert
				onClose={handleCloseSnackBar}
				severity={severity}
				sx={{ width: "100%", color: "secondary.contrastText" }}
				variant="filled"
			>
				{msg}
			</Alert>
		</Snackbar>
	);
}
