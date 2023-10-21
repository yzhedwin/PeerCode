import { green, orange, red } from "@mui/material/colors";
import LoadingIcon from "./LoadingIcon";

function CoolButton(props) {
	const { text, loading, onClick } = props;
	return (
		<button
			class="pushable"
			style={{
				background:
					text.toLowerCase() === "easy"
						? green[900]
						: text.toLowerCase() === "medium"
						? orange[900]
						: red[900],
			}}
			onClick={onClick}
		>
			<span
				class="front"
				style={{
					background:
						text.toLowerCase() === "easy"
							? green[600]
							: text.toLowerCase() === "medium"
							? orange[600]
							: red[600],
				}}
			>
				{loading ? (
					<div style={{ display: "flex" }}>
						<LoadingIcon text={text} />
					</div>
				) : (
					<span>{text}</span>
				)}
			</span>
		</button>
	);
}

export default CoolButton;
