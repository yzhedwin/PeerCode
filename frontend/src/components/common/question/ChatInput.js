import { TextField } from "@mui/material";

function ChatInput({ onSubmitChat, setTextInput, textInput, disabled }) {
	return (
		<div className="chat-input">
			<TextField
				disabled={disabled}
				sx={{
					color: "chat.contrastText",
					backgroundColor: "chat.input",
				}}
				fullWidth
				size="small"
				onKeyDown={onSubmitChat}
				onChange={(e) => {
					setTextInput(e.target.value);
				}}
				value={textInput}
				title={disabled ? "This function is disabled in SOLO" : "Type to chat"}
			/>
		</div>
	);
}

export default ChatInput;
