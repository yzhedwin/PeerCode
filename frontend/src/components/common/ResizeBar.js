import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useEffect, useState } from "react";

export default function ResizeBar({ setHeight, containerRef }) {
    const [drag, setDrag] = useState(false);
    const [color, setColor] = useState("#e5e1e1");
    const handleDrag = (event) => {
        console.log("dragging");
        const height =
            event.clientY - containerRef.current.getBoundingClientRect().top;
        const blockHeight = containerRef.current.offsetHeight;
        const newHeight = (height / blockHeight) * 100;
        setHeight(newHeight.toFixed(0));
    };
    const handleMouseEnter = () => {
        setColor("#0a84ff");
    };
    const handleMouseLeave = () => {
        setColor("#e5e1e1");
    };

    return (
        <div
            style={{
                display: "flex",
                backgroundColor: color,
                height: "10px",
                cursor: "ns-resize",
                justifyContent: "center",
                alignItems: "center",
            }}
            onMouseDown={() => {
                setDrag(true);
                console.log("clicked");
            }}
            onMouseUp={() => {
                setDrag(false);
                console.log("released");
            }}
            onDragStart={() => {
                console.log("start drag");
            }}
            onDrag={handleDrag}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <MoreHorizIcon />
        </div>
    );
}
