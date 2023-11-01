import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useCallback, useMemo, useRef, useState } from "react";
import { API_GATEWAY, EDITOR_SUPPORTED_LANGUAGES } from "../../utils/constants";
import axios from "axios";
import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
import SubmissionPopup from "./SubmissionPopup";
import "../../css/problemPage.scss";

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            style={{ height: "100%" }}
            {...other}
        >
            {value === index && (
                <Box sx={{ height: "100%" }}>
                    <Typography style={{ height: "100%" }}>
                        {children}
                    </Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `full-width-tab-${index}`,
        "aria-controls": `full-width-tabpanel-${index}`,
    };
}

export default function ProblemPageTabs(props) {
    const { description, userID, titleSlug } = props;
    const theme = useTheme();
    const [value, setValue] = useState(0);
    const [submission, setSubmission] = useState({});
    const [openSubmission, setOpenSubmission] = useState(false);
    const [rowData, setRowData] = useState(); // Set rowData to Array of Objects, one Object per Row

    const gridRef = useRef(); // Optional - for accessing Grid's API

    // Each Column Definition results in one Column.
    const columnDefs = useMemo(
        () => [
            {
                field: "status",
                headerName: "Status",
                cellStyle: (params) => {
                    if (params.value === "Accepted") {
                        //mark police cells as red
                        return { color: "rgb(59, 255, 59)" };
                    }
                },
            },
            {
                field: "language",
                headerName: "Language",
                filter: true,
                filterParams: {},
            },
            {
                field: "runtime",
                headerName: "Runtime",
            },
            {
                field: "memory",
                headerName: "Memory",
            },
            {
                field: "notes",
                headerName: "Notes",
            },
        ],
        []
    );

    // DefaultColDef sets props common to all Columns
    const defaultColDef = useMemo(
        () => ({
            flex: 1,
        }),
        []
    );

    const handleChange = useCallback(async (event, newValue) => {
        setValue(newValue);
    }, []);
    const onGridReady = useCallback(async (params) => {
        try {
            const { data } = await axios.get(
                `${API_GATEWAY}/api/v1/question/history/user/question?userID=${userID}&titleSlug=${titleSlug}`
            );
            const tableData = data.map((d) => {
                const { feedback, submission } = d;
                return {
                    status: feedback.status.description,
                    memory: feedback.memory,
                    runtime: feedback.time,
                    code: submission.source_code,
                    finished_at: feedback.finished_at,
                    language: EDITOR_SUPPORTED_LANGUAGES.find(
                        (e) => e.id === submission.language_id
                    ).name,
                };
            });

            setRowData(tableData);
        } catch (e) {
            console.log(e);
        }
    }, []);

    const handleOpenSubmission = useCallback(({ data }) => {
        setSubmission(data);
        setOpenSubmission(true);
    }, []);
    const handleCloseSubmission = useCallback(() => {
        setOpenSubmission(false);
    }, []);

    return (
        <>
            <Box sx={{ bgcolor: "secondary", width: "95%", height: "100%" }}>
                <AppBar position="static">
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        indicatorColor="secondary"
                        textColor="inherit"
                        variant="fullWidth"
                        aria-label="full width tabs example"
                    >
                        <Tab label="Description" {...a11yProps(0)} />
                        <Tab label="Solutions" {...a11yProps(1)} />
                        <Tab label="Submissions" {...a11yProps(2)} />
                    </Tabs>
                </AppBar>
                <TabPanel value={value} index={0} dir={theme.direction}>
                    {description}
                </TabPanel>
                <TabPanel value={value} index={1} dir={theme.direction}>
                    solutions
                </TabPanel>
                <TabPanel value={value} index={2} dir={theme.direction}>
                    <div className="submissions-container">
                        <div
                            className="ag-theme-alpine"
                            style={{ width: "100%", height: "100%" }}
                        >
                            <AgGridReact
                                ref={gridRef} // Ref for accessing Grid's API
                                rowData={rowData} // Row Data for Rows
                                columnDefs={columnDefs} // Column Defs for Columns
                                defaultColDef={defaultColDef} // Default Column Properties
                                animateRows={true} // Optional - set to 'true' to have rows animate when sorted
                                rowSelection="single" // Options - allows click selection of rows
                                onCellClicked={handleOpenSubmission} // Optional - registering for Grid Event
                                onGridReady={onGridReady}
                            />
                        </div>
                    </div>
                </TabPanel>
            </Box>
            <SubmissionPopup
                openSubmission={openSubmission}
                handleCloseSubmission={handleCloseSubmission}
                submission={submission}
            />
        </>
    );
}
