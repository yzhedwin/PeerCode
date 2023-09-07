import "./css/App.scss";
import { useEffect, useState } from "react";
import Dashboard from "./pages/Dashboard";
import Header from "./components/common/Header";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { green, orange, red } from "@mui/material/colors";
import "ag-grid-enterprise";

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
      main: green[500],
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
      main: red[500],
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
  // const [data, setData] = useState();

  // const getMessage = async () => {
  //   try {
  //     const response = await axios.get("http://localhost:5000/");
  //     setData(response.data.message);
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  useEffect(() => {
    // getMessage();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <div>
        <Header />
        <Dashboard />
      </div>
    </ThemeProvider>
  );
}

export default App;
