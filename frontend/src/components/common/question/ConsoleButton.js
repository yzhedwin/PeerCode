import { Button, CircularProgress } from "@mui/material";
import React from "react";

function ConsoleButton(props) {
	const { title, icon, loading } = props;
	return (
		<Button variant="contained" color="secondary" {...props}>
			<div style={{ display: "flex", justifyContent: "center" }}>
				{icon}
				{loading ? (
					<CircularProgress size={"24px"} sx={{ color: "secondary.contrastText" }} />
				) : (
					title
				)}
			</div>
		</Button>
	);
}

export default ConsoleButton;
