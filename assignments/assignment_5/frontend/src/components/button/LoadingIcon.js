import * as React from "react";
import Box from "@mui/material/Box";
import Countdown from "react-countdown";
import "../../css/coolbutton.css";
import { MATCHMAKING_TIMEOUT } from "../../utils/constants";

export default function LoadingIcon({ text }) {
	return (
		<Box sx={{ display: "flex" }}>
			<Countdown
				date={Date.now() + parseInt(MATCHMAKING_TIMEOUT)}
				intervalDelay={0}
				precision={0}
				renderer={(props) => (
					<div>
						{text} {props.total / 1000}
					</div>
				)}
			/>
		</Box>
	);
}
