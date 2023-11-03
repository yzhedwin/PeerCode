import { useEffect, useState } from "react";
import { loader } from "@monaco-editor/react";
import { EDITOR_SUPPORTED_THEMES } from "./constants";
import PropTypes from "prop-types";
import { Box } from "@mui/material";

export function dateDiffInDays(a, b) {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

export const useBeforeRender = (callback, deps) => {
    const [isRun, setIsRun] = useState(false);

    if (!isRun) {
        callback();
        setIsRun(true);
    }

    useEffect(() => () => setIsRun(false), deps);
};

export const defineTheme = async (theme) => {
    return new Promise((res) => {
        Promise.all([
            loader.init(),
            import(
                `monaco-themes/themes/${EDITOR_SUPPORTED_THEMES[theme]}.json`
            ),
        ]).then(([monaco, themeData]) => {
            monaco.editor.defineTheme(theme, themeData);
            res();
        });
    });
};

export function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            style={{
                flex: 1,
                overflow: "auto",
            }}
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

export function a11yProps(index) {
    return {
        id: `full-width-tab-${index}`,
        "aria-controls": `full-width-tabpanel-${index}`,
    };
}

export function outputStatus(text) {
    if (text === "Accepted") {
        return { color: "rgb(59, 255, 59)" };
    } else if (
        text.split(" ").findIndex((e) => {
            return e.toLowerCase().includes("error");
        })
    ) {
        return { color: "red" };
    } else {
        return { color: "white" };
    }
}
