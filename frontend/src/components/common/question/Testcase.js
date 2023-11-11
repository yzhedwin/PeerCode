import "../../../css/testcase.scss";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { TabPanel } from "../../../utils/helper";
import { useTheme } from "@emotion/react";
import { useCallback, useState } from "react";

export default function Testcase(props) {
    const [value, setValue] = useState(0);
    const { setCustomTestCase, customTestCase, setTestCase } = props;
    const theme = useTheme();

    const handleChangeInput = useCallback(
        (e, caseIndex, param) => {
            let newTestCases = JSON.parse(JSON.stringify(customTestCase));
            newTestCases[caseIndex][param] = e.target.value;
            setCustomTestCase(newTestCases);
            //change to xxx\nyyy\n string format
            setTestCase(newTestCases[value]);
        },
        //eslint-disable-next-line
        [customTestCase, value]
    );

    const handleChange = (event, newValue) => {
        setValue(newValue);
        setTestCase(customTestCase[newValue]);
    };
    const testCaseInput = () => {
        return customTestCase?.map((tc, caseIndex) => {
            return (
                <TabPanel
                    key={`tabs-panel-${caseIndex}`}
                    value={value}
                    index={caseIndex}
                    dir={theme.direction}
                >
                    <div
                        key={`tabs-panel-div-${caseIndex}`}
                        className="testcase-item"
                    >
                        {Object.keys(tc).map((param, idx) => {
                            return (
                                <>
                                    <div
                                        key={`param-title-${idx}`}
                                        className="testcase-param-title"
                                    >
                                        {param + "="}
                                    </div>

                                    <div
                                        key={`param-value-${idx}`}
                                        className="testcase-param-value"
                                    >
                                        <input
                                            key={`testcase-input-field-${idx}`}
                                            className="testcase-param-value-input"
                                            value={tc[param]}
                                            onChange={(e) =>
                                                handleChangeInput(
                                                    e,
                                                    caseIndex,
                                                    param
                                                )
                                            }
                                        />
                                    </div>
                                </>
                            );
                        })}
                    </div>
                </TabPanel>
            );
        });
    };

    const testCaseTabs = () => {
        return customTestCase?.map((_, index) => {
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
                    {testCaseTabs()}
                </Tabs>
            </Box>
            <Box sx={{ flex: 1, backgroundColor: "primary.main" }}>
                {testCaseInput()}
            </Box>
        </div>
    );
}
