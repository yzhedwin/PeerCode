import { useCallback, useContext } from "react";
import { ProblemContext } from "../../contexts/ProblemContext";

function ChatBox({ isAI }) {
  const { message, aiMessage } = useContext(ProblemContext);

  const getMessages = useCallback(() => {
    if (isAI === false) {
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
          <div key={`${msg.user}${index}`}>
            {msg.user}
            {msg.data ? ": " : ""}
            {msg.data}
          </div>
        );
      });
    }
  }, [message, aiMessage]);

  return <>{getMessages()}</>;
}

export default ChatBox;
