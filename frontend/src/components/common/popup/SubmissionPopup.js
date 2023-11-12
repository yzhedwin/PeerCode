import { Box, IconButton, Modal, Typography } from "@mui/material";
import { Editor } from "@monaco-editor/react";
import CloseIcon from "@mui/icons-material/Close";
import { EDITOR_SUPPORTED_LANGUAGES } from "../../../utils/constants";
import React, { useCallback, useRef } from "react";

function SubmissionPopup(props) {
    const { openSubmission, handleCloseSubmission, submission } = props;
    const editorRef = useRef(null);
    const monacoRef = useRef(null);
    function handleEditorDidMount(editor, monaco) {
        editorRef.current = editor;
        monacoRef.current = monaco;
    }
    const SubmissionDetails = useCallback(() => {
        return (
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    flex: 1,
                    width: "100%",
                    marginInline: "10px",
                    color: "primary.contrastText",
                }}
            >
                {Object.keys(submission).map((key) => {
                    if (key !== "code") {
                        if (key === "finished_at") {
                            const date = new Date(submission[key]);
                            return (
                                <div>{`${key
                                    .charAt(0)
                                    .toUpperCase()}${key.substring(
                                    1
                                )}: ${date.getFullYear()}/${
                                    date.getMonth() + 1
                                }/${date.getDate()}, ${date
                                    .getHours()
                                    .toString()
                                    .padStart(2, 0)}:${date
                                    .getMinutes()
                                    .toString()
                                    .padStart(2, 0)}:${date
                                    .getSeconds()
                                    .toString()
                                    .padStart(2, 0)}`}</div>
                            );
                        }
                        return (
                            <div>{`${key
                                .charAt(0)
                                .toUpperCase()}${key.substring(1)}: ${
                                submission[key]
                            }`}</div>
                        );
                    }
                    return <></>;
                })}
            </Box>
        );
    }, [submission]);
    return (
        <Modal
            open={openSubmission}
            onClose={handleCloseSubmission}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "70%",
                    height: "70%",
                    backgroundColor: "primary.main",
                    border: "2px solid #000",
                    boxShadow: 24,
                    p: 4,
                }}
            >
                <Typography
                    id="modal-modal-title"
                    variant="h6"
                    component="h2"
                    textAlign={"center"}
                    sx={{
                        backgroundColor: "primary.main",
                        color: "primary.contrastText",
                    }}
                >
                    <div> Submission</div>
                    <IconButton
                        style={{
                            position: "absolute",
                            right: 0,
                            top: 0,
                        }}
                        onClick={handleCloseSubmission}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Typography>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        backgroundColor: "primary.main",
                        height: "100%",
                    }}
                >
                    <Box
                        sx={{
                            flex: 3,
                        }}
                    >
                        <Editor
                            height="100%"
                            language={
                                EDITOR_SUPPORTED_LANGUAGES.find((lang) => {
                                    return lang.name === submission?.language;
                                })?.raw
                            }
                            theme="vs-dark"
                            value={submission.code}
                            onMount={handleEditorDidMount}
                            options={{
                                readOnly: true,
                                inlineSuggest: true,
                                fontSize: "16px",
                                formatOnType: true,
                                autoClosingBrackets: true,
                                minimap: { scale: 5 },
                            }}
                        />
                    </Box>
                    <SubmissionDetails />
                </Box>
            </Box>
        </Modal>
    );
}
export default React.memo(SubmissionPopup);
