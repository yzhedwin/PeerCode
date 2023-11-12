import { useSelector } from "react-redux";
import { NavLink, Outlet } from "react-router-dom";
import { FirebaseContext } from "../../contexts/FirebaseContext";
import { useContext } from "react";
import { QuestionProvider } from "../../contexts/QuestionContext";
import { MatchProvider } from "../../contexts/MatchContext";
import { ProblemProvider } from "../../contexts/ProblemContext";
import Header from "../common/Header";
import WebSocket from "../services/WebSocket";

const ProtectedRoute = () => {
  const { currentUser } = useContext(FirebaseContext);
  const { userInfo } = useSelector((state) => state.auth);

  // show unauthorized screen if no user is found in redux store
  if (!currentUser) {
    return (
      <div
        className="unauthorized"
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          height: "90vh",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1>You are not signed in!</h1>
        <span>
          <NavLink to="/login">Login</NavLink> to gain access
        </span>
      </div>
    );
  }

  return (
    <QuestionProvider>
      <MatchProvider>
        <ProblemProvider>
          <Header />
          <WebSocket />
          <Outlet />
        </ProblemProvider>
      </MatchProvider>
    </QuestionProvider>
  );
};

export default ProtectedRoute;
