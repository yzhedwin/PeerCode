import "./css/App.scss";
import Dashboard from "./pages/Dashboard";
import Header from "./components/common/Header";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { green, grey, orange, red } from "@mui/material/colors";
import "ag-grid-enterprise";
import { QuestionProvider } from "./contexts/QuestionContext";
import ProblemPage from "./pages/Problem";
import { BrowserRouter as Router } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import Profile from "./pages/Profile";
import WebSocket from "./components/common/WebSocket";
import { SnackBarProvider } from "./contexts/SnackBarContext";
import { MatchProvider } from "./contexts/MatchContext";
import CoopPage from "./pages/CoopPage";
import { CoopProvider } from "./contexts/CoopContext";
import { ModeContext } from "./contexts/ModeContext";
import { useContext } from "react";

function App() {
  const { mode } = useContext(ModeContext);
  const theme = createTheme({
    palette: {
      mode: mode,
      primary: {
        ...(mode === "dark"
          ? {
              main: "#868686",
              console: grey[900],
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
      question_easy: {
        ...(mode === "dark"
          ? {
              light: green[300],
              dark: green[800],
              contrastText: "#fff",
              main: "#20900D",
            }
          : {
              light: green[300],
              dark: green[800],
              contrastText: "#000",
              main: "#20900D",
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
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <SnackBarProvider>
          <QuestionProvider>
            <MatchProvider>
              <CoopProvider>
                <WebSocket />
                <Header />
                <Routes>
                  <Route exact path="/" element={<Dashboard />} />
                  <Route exact path="/problem" element={<ProblemPage />} />
                  <Route exact path="/match" element={<CoopPage />} />
                  <Route exact path="/profile" element={<Profile />} />
                </Routes>
              </CoopProvider>
            </MatchProvider>
          </QuestionProvider>
        </SnackBarProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
