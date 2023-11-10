import { Outlet } from "react-router-dom";
import Header from "../common/Header";

export const NoAuthLayout = () => {
    return (
        <div>
            <Header />
            <Outlet />
        </div>
    );
};
