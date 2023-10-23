import { useCallback, useContext } from "react";
import { ProblemContext } from "../../contexts/ProblemContext";

function ChatBox() {
	const { message } = useContext(ProblemContext);

	const getMessages = useCallback(() => {
		return message.map((msg, index) => {
			return (
				<div key={`${msg.user}${index}`}>
					{msg.user}
					{msg.data ? ": " : ""}
					{msg.data}
				</div>
			);
		});
	}, [message]);

	return <>{getMessages()}</>;
}

export default ChatBox;
