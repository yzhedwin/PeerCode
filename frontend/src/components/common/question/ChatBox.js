import { useCallback, useContext, useEffect } from "react";
import { ProblemContext } from "../../../contexts/ProblemContext";
import { Box } from "@mui/material";
import "../../../css/chatbox.scss";
function ChatBox({ isAI }) {
  const { message, aiMessage } = useContext(ProblemContext);

  const getMessages = useCallback(() => {
    if (!isAI) {
      return message.map((msg, index) => {
        if (msg.data) {
          return msg?.user !== "me" ? (
            <div class="message droplet" key={`${msg?.user}${index}`}>
              <div class="message__text">
                <Box
                  class="message__text__content"
                  sx={{ color: "chat.contrastText" }}
                >
                  {msg?.data}
                  <div class="message__time">{msg?.time}</div>
                </Box>
              </div>
            </div>
          ) : (
            <div
              class="message my-message droplet"
              key={`${msg?.user}${index}`}
            >
              <div class="message__text">
                <div class="message__text__content">
                  {msg?.data}
                  <div class="message__time">{msg?.time}</div>
                </div>
              </div>
            </div>
          );
        }
        // return aiMessage.map((msg, index) => {
        //   return (
        //     <div className={`${msg.role}`} key={`${msg.role}${index}`}>
        //       {msg.role == "user" ? "me" : "AI"}
        //       {msg.content ? ": " : ""}
        //       {msg.content}
        //     </div>
        //   );
        // });
        // }
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

  //keep scrollbar to bottom on new message
  useEffect(() => {
    let messageBody = document.querySelector(".chat-messages");
    messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
  }, [message]);

  return (
    <Box className="chat-messages" sx={{ color: "chat.contrastText" }}>
      {getMessages()}
    </Box>
  );
}

export default ChatBox;
