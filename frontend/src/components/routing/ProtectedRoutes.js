import { useSelector } from "react-redux";
import { NavLink, Outlet } from "react-router-dom";
import { FirebaseContext } from "../../contexts/FirebaseContext";
import { useContext } from "react";

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

  return <Outlet />;
};

export default ProtectedRoute;
