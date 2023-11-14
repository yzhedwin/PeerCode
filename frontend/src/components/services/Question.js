import { useCallback, useContext, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
import axios from "axios";
import { QuestionContext } from "../../contexts/QuestionContext";
import { useNavigate } from "react-router-dom";
import { SnackBarContext } from "../../contexts/SnackBarContext";
import { ProblemContext } from "../../contexts/ProblemContext";
import { FirebaseContext } from "../../contexts/FirebaseContext";
import { TitleCellRenderer } from "./TitleCellRenderer";
import { BtnCellRenderer } from "./BtnCellRenderer";
import { Modal, Button } from "react-bootstrap";
import "../../css/question.scss";
import { API_GATEWAY, QUESTION_STATUS } from "../../utils/constants";

function Question() {
    const navigate = useNavigate();
    const { setSnippets } = useContext(ProblemContext);
    const { setQuestion } = useContext(QuestionContext);
    const { setSB, setOpenSnackBar } = useContext(SnackBarContext);
    const { isAdmin, currentUser } = useContext(FirebaseContext);
    const [show, setShow] = useState(false);
    const [titleSlug, setTitleSlug] = useState("");
    const [rowData, setRowData] = useState();
    const gridRef = useRef(); // Optional - for accessing Grid's API
    // Each Column Definition results in one Column.
    const handleClose = () => {
        setShow(false);
    };
    const handleShow = () => setShow(true);

    const handleDelete = async () => {
        try {
            await axios.delete(
                API_GATEWAY + `/api/v1/question/title/${titleSlug}`
            );
            window.location.reload();
        } catch (e) {
            console.log(e);
        }
    };

    const columnDefs = useMemo(
        () => [
            { headerName: "No.", valueGetter: "node.id" },
            {
                field: "slugPair",
                headerName: "Title",
                cellRenderer: TitleCellRenderer,
                cellRendererParams: {
                    clicked: function (field) {
                        cellClickedListener(field);
                    },
                },
            },
            {
                headerName: "Tags",
                valueGetter: (params) => {
                    if (Array.isArray(params.data.topicTags)) {
                        return params.data.topicTags
                            .map((tag) => tag.name)
                            .join(", ");
                    }
                    return "";
                },
                filter: true,
                filterParams: {},
            },
            {
                field: "difficulty",
                headerName: "Difficulty",
                filter: true,
                filterParams: {},
            },
            {
                field: "status",
                headerName: "Status",
                filter: true,
                filterParams: {},
            },
            {
                field: "titleSlug",
                headerName: "Actions",
                hide: !isAdmin,
                cellRenderer: BtnCellRenderer,
                cellRendererParams: {
                    clicked: function (event) {
                        const action = event[0];
                        const ts = event[1];
                        if (action === "e") {
                            const question = rowData?.find(
                                (qn) => qn.titleSlug === ts
                            );
                            const categories = question?.topicTags
                                ?.map((a) => a.name)
                                .join();
                            navigate("/edit", {
                                state: {
                                    titleSlug: question.titleSlug,
                                    title: question.title,
                                    description: question.problem,
                                    categories: categories,
                                    difficulty: question.difficulty,
                                },
                            });
                        } else if (action === "d") {
                            setTitleSlug(ts);
                            handleShow();
                        }
                    },
                },
            },
        ],
        //eslint-disable-next-line
        [rowData, isAdmin]
    );

    // DefaultColDef sets props common to all Columns
    const defaultColDef = useMemo(
        () => ({
            flex: 1,
        }),
        //eslint-disable-next-line
        []
    );
    const rowClass = "question-not-completed";
    const onGridReady = useCallback(async (params) => {
        try {
            const [questions, status] = await Promise.all([
                axios.get(API_GATEWAY + "/api/v1/question"),
                axios.get(
                    API_GATEWAY + `/api/v1/question-status?userID=${currentUser?.uid}`
                ),
            ]);
            const { data } = questions;
            for (let i = 0; i < data.length; i++) {
                const currentTitleSlug = data[i]?.titleSlug;
                const s = status.data.find((s) => {
                    return s.titleSlug === currentTitleSlug;
                });
                if (s) {
                    data[i].status = s.description;
                }
                data[i].slugPair = {
                    title: data[i].title,
                    slug: data[i].titleSlug,
                };
            }

            Array.isArray(data) ? setRowData(data) : setRowData([]);
        } catch (e) {
            setSB({ msg: `Question Service: ${e.message}`, severity: "error" });
            setOpenSnackBar(true);
        }
        //eslint-disable-next-line
    }, []);

    // all even rows assigned 'my-shaded-effect'
    const getRowClass = (params) => {
        if (params.node.data.status === QUESTION_STATUS.COMPLETED) {
            return "question-completed";
        } else if (params.node.data.status === QUESTION_STATUS.ATTEMPTED) {
            return "question-inprogress";
        }
    };

    const cellClickedListener = useCallback(async (event) => {
        try {
            if (event) {
                console.log(event);
                const snippets = await axios.get(
                    API_GATEWAY + `/api/v1/question/codesnippets?titleSlug=${event.data?.titleSlug}`
                );
                console.log(snippets["data"]);
                setQuestion({
                    id: event.rowIndex,
                    title: event.data?.title,
                    titleSlug: event.data?.titleSlug,
                    difficulty: event.data?.difficulty,
                    status: event.data?.status,
                    problem: event.data?.problem,
                });
                setSnippets(snippets["data"]);
                navigate("/problem");
            }
        } catch (e) {
            setSB({ msg: `Question Service: ${e.message}`, severity: "error" });
            setOpenSnackBar(true);
        }
        //eslint-disable-next-line
    }, []);

    return (
        <div className="question-container">
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Question</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this question?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        No
                    </Button>
                    <Button variant="primary" onClick={handleDelete}>
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>
            <div
                className="ag-theme-alpine ag-theme-alpine-dashboard"
                style={{ width: "100%", height: "100%" }}
            >
                <AgGridReact
                    ref={gridRef} // Ref for accessing Grid's API
                    rowData={rowData} // Row Data for Rows
                    columnDefs={columnDefs} // Column Defs for Columns
                    defaultColDef={defaultColDef} // Default Column Properties
                    animateRows={true} // Optional - set to 'true' to have rows animate when sorted
                    rowSelection="single" // Options - allows click selection of rows
                    //onCellClicked={cellClickedListener} // Optional - registering for Grid Event
                    rowClass={rowClass}
                    getRowClass={getRowClass}
                    pagination={true}
                    paginationAutoPageSize={true}
                    onGridReady={onGridReady}
                />
            </div>
        </div>
    );
}

export default Question;
