import React, { useContext, useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import { socket } from "./WebSocket";
import { FirebaseContext } from "../../contexts/FirebaseContext";
import { MatchContext } from "../../contexts/MatchContext";
import ConsoleButton from "../common/question/ConsoleButton";
import { SnackBarContext } from "../../contexts/SnackBarContext";
import "../../css/videocall.scss";
import { useDrag } from "../common/useDrag";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import MinimizeIcon from "@mui/icons-material/Minimize";
function VideoCall() {
    const [stream, setStream] = useState(null);
    const [receivingCall, setReceivingCall] = useState(false);
    const [callerSignal, setCallerSignal] = useState(null);
    const [callAccepted, setCallAccepted] = useState(false);
    const [caller, setCaller] = useState("");
    const [callEnded, setCallEnded] = useState(true);
    const { currentName } = useContext(FirebaseContext);
    const { match } = useContext(MatchContext);
    const userVideo = useRef(null);
    const connectionRef = useRef(null);
    const myVideo = useRef(null);
    const { setOpenSnackBar, setSB } = useContext(SnackBarContext);
    const draggableRef = useRef(null);
    const [isMute, setIsMute] = useState(false);
    const [minimize, setMinimize] = useState(false);
    const { position, handleMouseDown } = useDrag({
        ref: draggableRef,
    });

    useEffect(() => {
        navigator.mediaDevices
            .getUserMedia({ video: true, audio: true })
            .then((stream) => {
                setStream(stream);
                if (myVideo.current) {
                    myVideo.current.srcObject = stream;
                }
            })
            .catch((error) => {
                console.error("Error accessing media devices:", error);
            });

        socket.on("callUser", (data) => {
            setReceivingCall(true);
            setCaller(data.from);
            setCallerSignal(data.signal);
        });
        return () => {
            socket.off("callUser", (data) => {
                setReceivingCall(true);
                setCaller(data.from);
                setCallerSignal(data.signal);
            });
        };
    }, []);
    const callUser = (id) => {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: stream,
        });

        peer.on("signal", (data) => {
            socket.emit("callUser", {
                room: match,
                signalData: data,
                from: currentName,
                name: currentName,
            });
        });

        peer.on("stream", (stream) => {
            if (userVideo.current) {
                userVideo.current.srcObject = stream;
            }
        });

        socket.on("callAccepted", (signal) => {
            setCallAccepted(true);
            setCallEnded(false);
            peer.signal(signal);
        });

        connectionRef.current = peer;
    };

    const answerCall = () => {
        setCallAccepted(true);
        setCallEnded(false);
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: stream,
        });

        peer.on("signal", (data) => {
            socket.emit("answerCall", {
                signal: data,
                room: match,
                from: currentName,
            });
        });

        peer.on("stream", (stream) => {
            if (userVideo.current) {
                userVideo.current.srcObject = stream;
            }
        });

        peer.signal(callerSignal);
        connectionRef.current = peer;
    };

    useEffect(() => {
        if (receivingCall) {
            setSB({
                msg: `Receiving call from ${caller}`,
                severity: "warning",
            });
            setOpenSnackBar(true);
        }
    }, [receivingCall]);

    const handleMinimize = () => {
        setMinimize((prevState) => (prevState ? false : true));
        console.log(minimize);
    };
    return (
        <>
            {stream && (
                <div
                    className="video-chat-container"
                    ref={draggableRef}
                    style={{
                        top: position.y,
                        left: position.x,
                    }}
                >
                    <div
                        className="draggable-panel"
                        onMouseDown={handleMouseDown}
                    >
                        <DragHandleIcon />
                        <div id="minimize" onClick={handleMinimize}>
                            <MinimizeIcon />
                        </div>
                    </div>
                    <div className="video-container">
                        <video
                            className="rounded-full"
                            playsInline
                            ref={myVideo}
                            autoPlay
                            style={
                                minimize
                                    ? { width: "200px", display: "none" }
                                    : {
                                          width: "200px",
                                          display: "inherit",
                                          margin: "5px",
                                      }
                            }
                        />
                        {callAccepted && !callEnded && (
                            <video
                                className="rounded-full"
                                playsInline
                                ref={userVideo}
                                muted={isMute}
                                autoPlay
                                style={
                                    minimize
                                        ? { width: "200px", display: "none" }
                                        : {
                                              width: "200px",
                                              display: "inherit",
                                              margin: "5px",
                                          }
                                }
                            />
                        )}
                    </div>
                </div>
            )}

            {receivingCall && !callAccepted ? (
                <ConsoleButton
                    title={"Accept"}
                    onClick={answerCall}
                    sx={{
                        ml: "auto",
                        backgroundColor: "green",
                        mb: 1,
                    }}
                />
            ) : (
                <ConsoleButton
                    title={"Call"}
                    onClick={callUser}
                    disabled={callAccepted}
                    sx={{
                        ml: "auto",
                        backgroundColor: "green",
                        mb: 1,
                    }}
                />
            )}
        </>
    );
}

export default VideoCall;
