import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { Container } from "react-bootstrap";
import { AuthProvider } from "./contexts/AuthContext";

import Login from "./components/auth_components/Login";
import ForgotPassword from "./components/auth_components/ForgotPassword";
import Signup from "./components/auth_components/Signup";

import Profile from "./components/profile_components/Profile";
import UpdateProfile from "./components/profile_components/UpdateProfile";
import CreateProfile from "./components/profile_components/CreateProfile";

import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoutes";

function App() {
  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="w-100">
        <Router>
          <AuthProvider>
            <Routes>
              <Route element={<ProtectedRoute />}>
                <Route exact path="/Dashboard" element={<Dashboard />} />
                <Route exact path="/profile" element={<Profile />} />
                <Route exact path="/update-profile" element={<UpdateProfile />} />
                <Route exact path="/create-profile" element={<CreateProfile />} />
              </Route>
              <Route exact path="/" element={<Login />} />
              <Route exact path="/signup" element={<Signup />} />
              <Route
                path="/forgot-password"
                element={<ForgotPassword />}
              ></Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AuthProvider>
        </Router>
      </div>
    </Container>
  );
}

export default App;
