import { useCallback, useContext } from "react";
import { ProblemContext } from "../../../contexts/ProblemContext";

function ChatBox({ isAI }) {
  const { message, aiMessage } = useContext(ProblemContext);

  const getMessages = useCallback(() => {
    if (!isAI) {
      return message.map((msg, index) => {
        return (
          <div key={`${msg.user}${index}`}>
            {msg.user}
            {msg.data ? ": " : ""}
            {msg.data}
          </div>
        );
      });
    } else {
      return aiMessage.map((msg, index) => {
        return (
          <div className={`${msg.role}`} key={`${msg.role}${index}`}>
            {msg.role == "user" ? "me" : "AI"}
            {msg.content ? ": " : ""}
            {msg.content}
          </div>
        );
      });
    }
  }, [message, aiMessage]);

  return <div className="chat-message">{getMessages()}</div>;
}

export default ChatBox;
