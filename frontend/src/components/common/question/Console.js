import { useContext } from "react";
import { ProblemContext } from "../../../contexts/ProblemContext";
import { Box } from "@mui/material";
import { outputStatus } from "../../../utils/helper";
import React from "react";

function Console({ expectedOutput }) {
    const { consoleResult } = useContext(ProblemContext);
    return (
        <Box
            className="console-container"
            sx={{
                backgroundColor: "primary.console",
                color: "primary.contrastText",
                paddingInline: 1,
            }}
        >
            {consoleResult?.status?.description && (
                <div className="console-messages">
                    <div className="console-header-container">
                        <div
                            className="console-status"
                            style={outputStatus(
                                consoleResult?.status?.description
                            )}
                        >
                            {consoleResult?.status?.description}
                        </div>
                        {!consoleResult?.status?.description
                            ?.toLowerCase()
                            .includes("error") && (
                            <div className="console-runtime">
                                Runtime:{" "}
                                {consoleResult?.time
                                    ? consoleResult?.time * 1000 + "ms"
                                    : ""}
                            </div>
                        )}
                    </div>

                    <div className="console-message-container-2">
                        {consoleResult?.status?.description
                            ?.toLowerCase()
                            .includes("error") ? (
                            <div>
                                <div className="console-stderr">
                                    {consoleResult?.stderr}
                                </div>
                            </div>
                        ) : consoleResult.status?.id === 4 ? (
                            <div>
                                <div className="console-title">Output </div>
                                <div className="console-stdout">
                                    {consoleResult?.stdout}
                                </div>
                                <div className="console-title">Expected </div>
                                <div className="console-stdout">
                                    {expectedOutput}
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div className="console-title">Output </div>
                                <div className="console-stdout">
                                    {consoleResult?.stdout}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </Box>
    );
}

export default Console;
