import {
  Navigate,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import SignUp from "../../pages/SignUp";
import Login from "../../pages/Login";
import Dashboard from "../../pages/Dashboard";
import ProblemPage from "../../pages/ProblemPage";
import Profile from "../../pages/Profile";
import CreateQuestion from "../../pages/CreateQuestion";
import EditQuestion from "../../pages/EditQuestion";
import ProtectedRoute from "./ProtectedRoutes";
import RedirectedRoute from "./RedirectedRoute";
import { NoAuthLayout } from "./NoAuthLayout";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<NoAuthLayout />}>
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/signup" element={<SignUp />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route exact path="/dashboard" element={<Dashboard />} />
        <Route exact path="/problem" element={<ProblemPage type={"solo"} />} />
        <Route exact path="/match" element={<ProblemPage type={"coop"} />} />
        <Route exact path="/profile" element={<Profile />} />
        <Route exact path="/create" element={<CreateQuestion />} />
        <Route exact path="/edit" element={<EditQuestion />} />
        <Route element={<RedirectedRoute />}>
          <Route exact path="/" element={<Login />} />
        </Route>
      </Route>
    </>
  )
);
