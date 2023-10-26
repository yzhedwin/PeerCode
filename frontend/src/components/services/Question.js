import { useCallback, useContext, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
import axios from "axios";
import { QuestionContext } from "../../contexts/QuestionContext";
import { useNavigate } from "react-router-dom";

import { SnackBarContext } from "../../contexts/SnackBarContext";
import { TitleCellRenderer } from "./TitleCellRenderer";
import { BtnCellRenderer } from "./BtnCellRenderer";

import { Modal, Button } from "react-bootstrap";

function Question() {
  const navigate = useNavigate();
  const { setQuestion } = useContext(QuestionContext);
  const { setSB, setOpenSnackBar } = useContext(SnackBarContext);
  const gridRef = useRef(); // Optional - for accessing Grid's API
  const [rowData, setRowData] = useState(); // Set rowData to Array of Objects, one Object per Row
  // Each Column Definition results in one Column.

  const [show, setShow] = useState(false);
  const [titleSlug, setTitleSlug] = useState("");
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => setShow(true);

  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/v1/question/title/${titleSlug}`
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
        cellRenderer: BtnCellRenderer,
        cellRendererParams: {
          clicked: function (event) {
            const action = event[0];
            const ts = event[1];
            if (action === "e") {
              const question = rowData.find((qn) => qn.titleSlug === ts);
              const categories = question.topicTags.map((a) => a.name).join();
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
    [rowData]
  );

  // DefaultColDef sets props common to all Columns
  const defaultColDef = useMemo(
    () => ({
      flex: 1,
    }),
    []
  );
  const rowClass = "question-not-completed";

  // all even rows assigned 'my-shaded-effect'
  const getRowClass = (params) => {
    if (params.node.data.status === "Completed") {
      return "question-completed";
    } else if (params.node.data.status === "Attempted") {
      return "question-inprogress";
    }
  };

  const cellClickedListener = useCallback(
    async (event) => {
      try {
        const question = rowData.find((qn) => qn.titleSlug === event);
        if (question && question.problem != null) {
          const data = question.problem;
          setQuestion({ titleSlug: event, problem: data });
        } else {
          const { data } = await axios.get(
            `http://localhost:5000/api/v1/question/problem/${event}`
          );
          setQuestion({ titleSlug: event, problem: data });
        }

        navigate("/problem");
      } catch (e) {
        setSB({ msg: `Question Service: ${e.message}`, severity: "error" });
        setOpenSnackBar(true);
      }
    },
    [rowData]
  );

  const onGridReady = useCallback(async (params) => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/v1/question");
      for (var i = 0; i < data.length; i++) {
        data[i].slugPair = { title: data[i].title, slug: data[i].titleSlug };
      }
      console.log(data);
      setRowData(data);
    } catch (e) {
      setSB({ msg: `Question Service: ${e.message}`, severity: "error" });
      setOpenSnackBar(true);
    }
  }, []);

  return (
    <div className="question-container">
      <>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Delete Question</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete this question {titleSlug}?
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
      </>
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
