import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    API_GATEWAY,
    EDITOR_SUPPORTED_LANGUAGES,
    QUESTION_STATUS,
} from "../../../utils/constants";
import axios from "axios";
import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
import SubmissionPopup from "../popup/SubmissionPopup";
import "../../../css/problemPage.scss";
import Solutions from "../../solution/Solutions";
import { outputStatus } from "../../../utils/helper";
import parse from "html-react-parser";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { green } from "@mui/material/colors";

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`problempage-full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            style={{ height: "100%" }}
            {...other}
        >
            {value === index && <Box sx={{ height: "100%" }}>{children}</Box>}
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
        id: `problempage-full-width-tab-${index}`,
        "aria-controls": `full-width-tabpanel-${index}`,
    };
}

function ProblemPageTabs(props) {
    const { userID, question } = props;
    const description = parse(
        typeof question?.problem === "string"
            ? question.problem
            : "Failed to load"
    );
    const theme = useTheme();
    const [value, setValue] = useState(0);
    const [submission, setSubmission] = useState({});
    const [openSubmission, setOpenSubmission] = useState(false);
    const [rowData, setRowData] = useState(); // Set rowData to Array of Objects, one Object per Row
    const gridRef = useRef(); // Optional - for accessing Grid's API
    const [solutions, setSolutions] = useState([]);
    // Each Column Definition results in one Column.
    const columnDefs = useMemo(
        () => [
            {
                field: "status",
                headerName: "Status",
                cellStyle: (params) => outputStatus(params.value),
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

    const getSolutions = useCallback(async () => {
        try {
            const { data } = await axios.get(
                `${API_GATEWAY}/api/v1/question/solution/community/list`,
                { params: { titleSlug: question?.titleSlug } }
            );
            const list = data?.map((d) => {
                const {
                    id,
                    title,
                    commentCount,
                    solutionTags,
                    viewCount,
                    post: {
                        voteCount,
                        creationDate,
                        author: {
                            username,
                            profile: { userAvatar, reputation },
                        },
                    },
                } = d;
                return {
                    id,
                    title,
                    commentCount,
                    solutionTags,
                    viewCount,
                    voteCount,
                    username,
                    userAvatar,
                    creationDate,
                    reputation,
                };
            });
            setSolutions(list);
        } catch (e) {
            console.log(e);
        }
    }, [question?.titleSlug]);

    const handleChange = useCallback(async (event, newValue) => {
        setValue(newValue);
    }, []);

    const onSubmissionReady = useCallback(
        async (params) => {
            try {
                const { data } = await axios.get(
                    `${API_GATEWAY}/api/v1/question/history/user/question?userID=${userID}&titleSlug=${question?.titleSlug}`
                );
                const tableData = data?.map((d) => {
                    const { feedback, submission } = d;
                    return {
                        status: feedback.status.description,
                        memory: feedback.memory,
                        runtime: feedback.time,
                        code: submission.source_code,
                        finished_at: feedback.finished_at,
                        language: EDITOR_SUPPORTED_LANGUAGES?.find(
                            (e) => e.id === submission?.language_id
                        )?.name,
                    };
                });
                setRowData(tableData);
            } catch (e) {
                console.log(e);
            }
        },
        [question?.titleSlug, userID]
    );

    const handleOpenSubmission = useCallback(({ data }) => {
        setSubmission(data);
        setOpenSubmission(true);
    }, []);
    const handleCloseSubmission = useCallback(() => {
        setOpenSubmission(false);
    }, []);

    useEffect(() => {
        getSolutions();
        //eslint-disable-next-line
    }, []);

    return (
        <>
            <Box sx={{ width: "95%", height: "100%" }}>
                <AppBar position="static">
                    <Tabs
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-around",
                            minHeight: "40px",
                        }}
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
                    <div className="problem-description-page">
                        <div style={{ fontWeight: "1000" }}>
                            {question?.id} {question?.title}
                        </div>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <Box
                                sx={{
                                    color: `question_${question?.difficulty?.toLowerCase()}.main`,
                                    fontWeight: 1000,
                                    fontSize: "14px",
                                    mt: 1,
                                    mb: 1,
                                    mr: 2,
                                }}
                            >
                                {question?.difficulty}
                            </Box>
                            {question?.status === QUESTION_STATUS.COMPLETED && (
                                <div title="Solved">
                                    <TaskAltIcon
                                        sx={{
                                            color: green[600],
                                            fontSize: "18px",
                                            strokeWidth: 0.7,
                                            stroke: green[600],
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                        <div style={{ fontSize: "16px" }}>{description}</div>
                    </div>
                </TabPanel>
                <TabPanel value={value} index={1} dir={theme.direction}>
                    <Solutions list={solutions} />
                </TabPanel>
                <TabPanel value={value} index={2} dir={theme.direction}>
                    <div className="submissions-container">
                        <div
                            className="ag-theme-alpine ag-theme-alpine-submission"
                            style={{ width: "100%", height: "95%" }}
                        >
                            <AgGridReact
                                ref={gridRef} // Ref for accessing Grid's API
                                rowData={rowData} // Row Data for Rows
                                columnDefs={columnDefs} // Column Defs for Columns
                                defaultColDef={defaultColDef} // Default Column Properties
                                animateRows={true} // Optional - set to 'true' to have rows animate when sorted
                                rowSelection="single" // Options - allows click selection of rows
                                onCellClicked={handleOpenSubmission} // Optional - registering for Grid Event
                                onGridReady={onSubmissionReady}
                                pagination={true}
                                paginationPageSize={20}
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
export default memo(ProblemPageTabs);
