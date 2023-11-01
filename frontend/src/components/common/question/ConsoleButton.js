import { Button } from "@mui/material";

function ConsoleButton(props) {
	const { title, icon } = props;
	return (
		<Button variant="contained" color="secondary" {...props}>
			<div style={{ display: "flex", justifyContent: "center" }}>
				{icon}
				{title}
			</div>
		</Button>
	);
}

export default ConsoleButton;
