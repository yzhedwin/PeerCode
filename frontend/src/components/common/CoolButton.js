import "../../css/coolbutton.scss";
import { green, grey, orange, red } from "@mui/material/colors";
import React, { useContext } from "react";
import { ModeContext } from "../../contexts/ModeContext";
import LoadingIcon from "./LoadingIcon";

function CoolButton(props) {
    const { text, loading, onClick, disabled } = props;
    const { mode } = useContext(ModeContext);
    return (
        <button
            className="pushable"
            style={{
                color: "white",
                background: disabled
                    ? grey[900]
                    : !disabled && text.toLowerCase() === "easy"
                    ? green[900]
                    : !disabled && text.toLowerCase() === "medium"
                    ? orange[900]
                    : red[900],
                cursor: disabled ? "wait" : "pointer",
            }}
            onClick={onClick}
            disabled={disabled}
        >
            <span
                className="front"
                style={{
                    background: disabled
                        ? grey[600]
                        : !disabled && text.toLowerCase() === "easy"
                        ? green[600]
                        : !disabled && text.toLowerCase() === "medium"
                        ? orange[600]
                        : red[600],
                }}
            >
                {loading ? (
                    <div style={{ display: "flex" }} data-testid="loading-icon" >
                        <LoadingIcon text={text} />
                    </div>
                ) : (
                    <span
                        style={{ color: mode === "dark" ? "white" : "black" }}
                    >
                        {text}
                    </span>
                )}
            </span>
        </button>
    );
}
//prevent rerender when parent state changes
export default React.memo(CoolButton);