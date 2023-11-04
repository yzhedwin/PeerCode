import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useEffect, useState } from "react";

export default function ResizeBar({ setHeight, containerRef }) {
    const [drag, setDrag] = useState(false);
    const [color, setColor] = useState("#e5e1e1");

    const handleMove = (event) => {
        if (!drag) {
            return;
        }
        const height =
            event.clientY - containerRef.current.getBoundingClientRect().top;
        const blockHeight = containerRef.current.offsetHeight;
        const newHeight = (height / blockHeight) * 100;
        setHeight(newHeight.toFixed(0));
    };

    const handleMouseUp = (e) => {
        setDrag(false);
    };
    const handleMouseDown = () => {
        setDrag(true);
    };
    const handleMouseEnter = () => {
        setColor("#0a84ff");
    };
    const handleMouseLeave = () => {
        setColor("#e5e1e1");
    };
    useEffect(() => {
        document.addEventListener("mousemove", handleMove);
        document.addEventListener("mouseup", handleMouseUp);
        return () => {
            document.removeEventListener("mousemove", handleMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
        //eslint-disable-next-line
    }, [drag]);

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
            onMouseDown={handleMouseDown}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <MoreHorizIcon />
        </div>
    );
}
