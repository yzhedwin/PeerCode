import { useCallback, useContext } from "react";
import { CoopContext } from "../../contexts/CoopContext";

function ChatBox() {
  const { message } = useContext(CoopContext);

  const getMessages = useCallback(() => {
    return message.map((msg, index) => {
      return (
        <div key={`${msg.user}${index}`}>
          {msg.user}
          {msg.data ? ":" : ""}
          {msg.data}
        </div>
      );
    });
  }, [message]);

  return <>{getMessages()}</>;
}

export default ChatBox;
