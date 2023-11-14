import "./css/App.scss";
import "ag-grid-enterprise";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { green, grey, orange, red } from "@mui/material/colors";
import { RouterProvider } from "react-router-dom";
import { SnackBarProvider } from "./contexts/SnackBarContext";
import { ModeContext } from "./contexts/ModeContext";
import { useContext } from "react";
import { Provider } from "react-redux";
import store from "./store";
import { useBeforeRender } from "./utils/helper";
import { router } from "./components/routing/router";

function App() {
    const { mode } = useContext(ModeContext);
    const theme = createTheme({
        palette: {
            mode: mode,
            action: {
                ...(mode === "dark"
                    ? {
                          disabledBackground: "#333333",
                          disabled: "#fff",
                      }
                    : { disabledBackground: "#fff", disabled: grey[900] }),
            },
            primary: {
                ...(mode === "dark"
                    ? {
                          main: "#282828",
                          console: "#282828",
                          contrastText: "#fff",
                      }
                    : {
                          main: "#fff",
                          console: "#fff",
                          contrastText: grey[900],
                      }),
            },
            secondary: {
                ...(mode === "dark"
                    ? {
                          main: "#333333",
                          contrastText: "#fff",
                      }
                    : {
                          main: "#fff",
                          contrastText: grey[900],
                      }),
            },
            chat: {
                ...(mode === "dark"
                    ? {
                          main: "#282828",
                          input: "#333333",
                          contrastText: grey[900],
                      }
                    : {
                          main: "#ffff",
                          input: "#333333",
                          contrastText: "#ffff",
                      }),
            },
            editor: {
                ...(mode === "dark"
                    ? {
                          main: grey[900],
                          contrastText: "#fff",
                      }
                    : {
                          main: "#ffff",
                          contrastText: grey[900],
                      }),
            },
            question_easy: {
                ...(mode === "dark"
                    ? {
                          light: green[300],
                          dark: green[800],
                          contrastText: "#fff",
                          main: "#00b8a3",
                      }
                    : {
                          light: green[300],
                          dark: green[800],
                          contrastText: "#000",
                          main: "#00b8a3",
                      }),
            },
            question_medium: {
                ...(mode === "dark"
                    ? {
                          light: orange[300],
                          dark: orange[800],
                          contrastText: "#fff",
                          main: orange[500],
                      }
                    : {
                          light: orange[300],
                          dark: orange[800],
                          contrastText: "#000",
                          main: orange[500],
                      }),
            },
            question_hard: {
                ...(mode === "dark"
                    ? {
                          light: red[300],
                          dark: red[800],
                          contrastText: "#fff",
                          main: "#E70000",
                      }
                    : {
                          light: red[300],
                          dark: red[800],
                          contrastText: "#000",
                          main: "#E70000",
                      }),
            },
            question_OTD: {
                ...(mode === "dark"
                    ? {
                          main: "#9747FF",
                          light: "#A45EFF",
                          dark: "#7B16FF",
                          contrastText: "#fff",
                      }
                    : {
                          light: "#A45EFF",
                          dark: "#7B16FF",
                          contrastText: "#000",
                          main: "#9747FF",
                      }),
            },
        },
    });
    useBeforeRender(() => {
        window.addEventListener("error", (e) => {
            if (e) {
                const resizeObserverErrDiv = document.getElementById(
                    "webpack-dev-server-client-overlay-div"
                );
                const resizeObserverErr = document.getElementById(
                    "webpack-dev-server-client-overlay"
                );
                if (resizeObserverErr)
                    resizeObserverErr.className = "hide-resize-observer";
                if (resizeObserverErrDiv)
                    resizeObserverErrDiv.className = "hide-resize-observer";
            }
        });
    }, []);

    return (
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <SnackBarProvider>
                    <RouterProvider router={router} />
                </SnackBarProvider>
            </ThemeProvider>
        </Provider>
    );
}

export default App;
