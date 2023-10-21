import { green, grey, orange, red } from "@mui/material/colors";
import LoadingIcon from "./LoadingIcon";

function CoolButton(props) {
	const { text, loading, onClick, disabled } = props;
	return (
		<button
			class="pushable"
			style={{
				color: "white",
				background: disabled
					? grey[900]
					: !disabled && text.toLowerCase() === "easy"
					? green[900]
					: !disabled && text.toLowerCase() === "medium"
					? orange[900]
					: red[900],
				cursor: disabled ? "wait" : "pointer",
			}}
			onClick={onClick}
			disabled={disabled}
		>
			<span
				class="front"
				style={{
					background: disabled
						? grey[600]
						: !disabled && text.toLowerCase() === "easy"
						? green[600]
						: !disabled && text.toLowerCase() === "medium"
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
