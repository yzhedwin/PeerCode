import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = () => {
  const { currentUser } = useAuth();

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
        <h2>You are not signed in!</h2>
        <span>
          <NavLink to="/login">Login</NavLink> to gain access
        </span>
      </div>
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
