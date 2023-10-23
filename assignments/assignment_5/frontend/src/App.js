import React from "react";
import {
	BrowserRouter as Router,
	Route,
	Routes,
	Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import ForgotPassword from "./components/ForgotPassword";
import UpdateProfile from "./components/UpdateProfile";
import CreateProfile from "./components/CreateProfile";
import { Container } from "react-bootstrap";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoutes";
import Websocket from "./components/Websocket";
import { MatchProvider } from "./contexts/MatchContext";

function App() {
	return (
		<Container
			className="d-flex align-items-center justify-content-center"
			style={{ minHeight: "100vh" }}
		>
			<div className="w-100">
				<Router>
					<AuthProvider>
						<MatchProvider>
							<Websocket />
							<Routes>
								<Route element={<ProtectedRoute />}>
									<Route exact path="/Dashboard" element={<Dashboard />} />
									<Route exact path="/profile" element={<Profile />} />
									<Route
										exact
										path="/update-profile"
										element={<UpdateProfile />}
									/>
									<Route
										exact
										path="/create-profile"
										element={<CreateProfile />}
									/>
								</Route>
								<Route exact path="/" element={<Login />} />
								<Route exact path="/signup" element={<Signup />} />
								<Route
									path="/forgot-password"
									element={<ForgotPassword />}
								></Route>
								<Route path="*" element={<Navigate to="/" replace />} />
							</Routes>
						</MatchProvider>
					</AuthProvider>
				</Router>
			</div>
		</Container>
	);
}

export default App;
