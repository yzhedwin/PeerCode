import { Navigate, Outlet } from "react-router-dom";
import { FirebaseContext } from "../../contexts/FirebaseContext";
import { useContext } from "react";

const ProtectedRoute = () => {
    const { currentUser } = useContext(FirebaseContext);

    // redirect to dashboard if there is a currentUser
    if (currentUser) {
        return <Navigate to="/dashboard" />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
