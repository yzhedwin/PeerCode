import { useSelector } from "react-redux";
import { NavLink, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);

  // show unauthorized screen if no user is found in redux store
  if (!userInfo) {
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
