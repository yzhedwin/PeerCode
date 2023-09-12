import { useCallback, useContext, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
import axios from "axios";
import { QuestionContext } from "../../contexts/QuestionContext";
import { useNavigate } from "react-router-dom";

function Question() {
  const navigate = useNavigate();
  const { setQuestion } = useContext(QuestionContext);
  const gridRef = useRef(); // Optional - for accessing Grid's API
  const [rowData, setRowData] = useState(); // Set rowData to Array of Objects, one Object per Row
  // Each Column Definition results in one Column.
  const columnDefs = useMemo(
    () => [
      { headerName: "No.", valueGetter: "node.id" },
      { field: "title", headerName: "Title" },
      { field: "difficulty", headerName: "Difficulty" },
      { field: "status", headerName: "Status" },
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
  const rowClass = "question-not-completed";

  // all even rows assigned 'my-shaded-effect'
  const getRowClass = (params) => {
    if (params.node.data.status === 1) {
      return "question-completed";
    } else if (params.node.data.status === 2) {
      return "question-inprogress";
    }
  };

  const cellClickedListener = useCallback((event) => {
    setQuestion(event.data);
    navigate("/problem");
  }, []);

  const onGridReady = useCallback(async (params) => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/v1/question");
      setRowData(data);
    } catch (e) {
      console.log(e);
    }
  }, []);

  return (
    <div className="question-container">
      <div className="question-filter-container">
        <div>Difficulty</div>
        <div>Status</div>
        <div>Tag</div>
      </div>
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
          onCellClicked={cellClickedListener} // Optional - registering for Grid Event
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
