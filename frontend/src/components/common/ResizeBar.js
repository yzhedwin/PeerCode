import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useEffect, useState } from "react";

export default function ResizeBar({ setHeight, containerRef }) {
    const [drag, setDrag] = useState(false);
    const handleDrag = (event) => {
        const height =
            event.clientY - containerRef.current.getBoundingClientRect().top;
        const blockHeight = containerRef.current.offsetHeight;
        const newHeight = (height / blockHeight) * 100;
        setHeight(newHeight.toFixed(0));
    };

    return (
        <div
            style={{
                display: "flex",
                backgroundColor: "#e5e1e1",
                height: "10px",
                cursor: "ns-resize",
                justifyContent: "center",
                alignItems: "center",
            }}
            onMouseDown={() => {
                setDrag(true);
            }}
            onMouseUp={() => {
                setDrag(false);
            }}
            onDrag={handleDrag}
        >
            <MoreHorizIcon />
        </div>
    );
}
