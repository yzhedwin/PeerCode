import { Box, CircularProgress } from "@mui/material";
import "../../css/coolbutton.scss";
import { green, orange, red } from "@mui/material/colors";
import { useContext } from "react";
import { ModeContext } from "../../contexts/ModeContext";
import LoadingIcon from "./LoadingIcon";

function CoolButton(props) {
  const { text, loading, onClick } = props;
  const { mode } = useContext(ModeContext);
  return (
    <button
      class="pushable"
      style={{
        background:
          text.toLowerCase() === "easy"
            ? green[900]
            : text.toLowerCase() === "medium"
            ? orange[900]
            : red[900],
      }}
      onClick={onClick}
    >
      <span
        class="front"
        style={{
          background:
            text.toLowerCase() === "easy"
              ? green[600]
              : text.toLowerCase() === "medium"
              ? orange[600]
              : red[600],
        }}
      >
        {loading ? (
          <div style={{ display: "flex" }}>
            <LoadingIcon />
          </div>
        ) : (
          <span style={{ color: mode === "dark" ? "white" : "black" }}>
            {text}
          </span>
        )}
      </span>
    </button>
  );
}

export default CoolButton;
