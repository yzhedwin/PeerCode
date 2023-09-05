import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState();

  const getMessage = async () => {
    try {
      const response = await axios.get("http://localhost:5000/");
      setData(response.data.message);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getMessage();
  }, []);

  return <div>{data}</div>;
}

export default App;
