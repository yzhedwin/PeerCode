import "./css/App.scss";
import Dashboard from "./pages/Dashboard";
import Header from "./components/common/Header";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { green, orange, red } from "@mui/material/colors";
import "ag-grid-enterprise";
import { QuestionProvider } from "./contexts/QuestionContext";
import ProblemPage from "./pages/Problem";
import { BrowserRouter as Router } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import Profile from "./pages/Profile";
import WebSocket from "./components/common/WebSocket";
import { SnackBarProvider } from "./contexts/SnackBarContext";
import { MatchProvider } from "./contexts/MatchContext";

const theme = createTheme({
  palette: {
    primary: {
      main: "#868686",
      contrastText: "#fff",
    },
    secondary: {
      main: "#333333",
      contrastText: "#fff",
    },
    question_easy: {
      light: green[300],
      dark: green[800],
      contrastText: "#fff",
      main: "#20900D",
    },
    question_medium: {
      light: orange[300],
      dark: orange[800],
      contrastText: "#fff",
      main: orange[500],
    },
    question_hard: {
      light: red[300],
      dark: red[800],
      contrastText: "#fff",
      main: "#E70000",
    },
    question_OTD: {
      main: "#9747FF",
      light: "#A45EFF",
      dark: "#7B16FF",
      contrastText: "#fff",
    },
  },
});

function App() {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <SnackBarProvider>
          <QuestionProvider>
            <MatchProvider>
              <WebSocket />
              <Header />
              <Routes>
                <Route exact path="/" element={<Dashboard />} />
                <Route exact path="/problem" element={<ProblemPage />} />
                <Route exact path="/profile" element={<Profile />} />
              </Routes>
            </MatchProvider>
          </QuestionProvider>
        </SnackBarProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
