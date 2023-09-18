import { useCallback, useContext } from "react";
import { MessageContext } from "../../contexts/MessageContext";

function ChatBox() {
  const { message } = useContext(MessageContext);

  const getMessages = useCallback(() => {
    return message.map((msg, index) => {
      return (
        <div key={`${msg.user}${index}`}>
          {msg.user}: {msg.data}
        </div>
      );
    });
  }, [message]);

  return <>{getMessages()}</>;
}

export default ChatBox;
