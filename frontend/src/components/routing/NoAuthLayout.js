import { Outlet } from "react-router-dom";
import Header from "../common/Header";
import { FirebaseContext } from "../../contexts/FirebaseContext";
import { useContext } from "react";

export const NoAuthLayout = () => {
  const { currentUser } = useContext(FirebaseContext);
  if (!currentUser) {
    return (
      <div>
        <Header />
        <Outlet />
      </div>
    );
  }
};
