import { useCallback, useContext, useEffect } from "react";
import { ProblemContext } from "../../../contexts/ProblemContext";
import { Box } from "@mui/material";
import "../../../css/chatbox.scss";
import { FirebaseContext } from "../../../contexts/FirebaseContext";
function ChatBox() {
    const { message } = useContext(ProblemContext);
    const { currentName } = useContext(FirebaseContext);
    console.log(message);
    const getMessages = useCallback(() => {
        return message.map((msg, index) => {
            if (msg.data) {
                return msg?.user !== "me" ? (
                    <div
                        className="message droplet"
                        key={`${msg?.user}${index}`}
                    >
                        <div className="message-username"> {msg?.user}</div>
                        <div className="message__text">
                            <Box
                                className="message__text__content"
                                sx={{ color: "chat.contrastText" }}
                            >
                                {msg?.data}
                                <div className="message__time">{msg?.time}</div>
                            </Box>
                        </div>
                    </div>
                ) : (
                    <div
                        className="message my-message droplet"
                        key={`${msg?.user}${index}`}
                    >
                        <div className="message__text">
                            <div className="message-username"> {msg?.user}</div>
                            <div className="message__text__content">
                                {msg?.data}
                                <div className="message__time">{msg?.time}</div>
                            </div>
                        </div>
                    </div>
                );
            }
        });
    }, [message]);

    //keep scrollbar to bottom on new message
    useEffect(() => {
        let messageBody = document.querySelector(".chat-messages");
        messageBody.scrollTop =
            messageBody.scrollHeight - messageBody.clientHeight;
    }, [message]);

    return (
        <Box className="chat-messages" sx={{ color: "chat.contrastText" }}>
            {getMessages()}
        </Box>
    );
}

export default ChatBox;
