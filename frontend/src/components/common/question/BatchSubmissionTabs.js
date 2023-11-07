import "../../../css/testcase.scss";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { TabPanel } from "../../../utils/helper";
import { useTheme } from "@emotion/react";
import { useContext, useState } from "react";
import Console from "./Console";
import { ProblemContext } from "../../../contexts/ProblemContext";

export default function BatchSubmissionTabs(props) {
    const { setConsoleResult } = useContext(ProblemContext);
    const [value, setValue] = useState(0);
    const { batchSubmission } = props;
    const theme = useTheme();

    const handleChange = (event, newValue) => {
        setValue(newValue);
        setConsoleResult(batchSubmission[newValue]);
    };
    const consolePanel = () => {
        return batchSubmission?.map((_, caseIndex) => {
            return (
                <TabPanel
                    key={`tabs-panel-${caseIndex}`}
                    value={value}
                    index={caseIndex}
                    dir={theme.direction}
                >
                    <Console
                        expectedOutput={
                            batchSubmission[caseIndex].expected_output
                        }
                    />
                </TabPanel>
            );
        });
    };

    const consoleTabs = () => {
        return batchSubmission?.map((_, index) => {
            return (
                <Tab
                    key={`case-tabs-${index + 1}`}
                    sx={{
                        color: "white",
                        ":focus": { color: "primary.contrastText" },
                        "&.Mui-selected": { color: "primary.contrastText" },
                    }}
                    label={`Case ${index + 1}`}
                />
            );
        });
    };

    return (
        <div className="testcase-container">
            <Box
                sx={{
                    display: "flex",
                    bgcolor: "primary.main",
                    alignItems: "center",
                }}
            >
                <Tabs
                    sx={{ minHeight: "20px" }}
                    value={value}
                    onChange={handleChange}
                >
                    {consoleTabs()}
                </Tabs>
            </Box>
            <Box sx={{ flex: 1, backgroundColor: "primary.main" }}>
                {consolePanel()}
            </Box>
        </div>
    );
}
