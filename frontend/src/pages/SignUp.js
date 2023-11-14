import React, { useContext } from "react";
import "../css/signup.scss";
import SnackBar from "../components/common/SnackBar";
import bgimage from "../assets/PeerCode.png";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import LoadingIcon from "../components/common/LoadingIcon";
import { SnackBarContext } from "../contexts/SnackBarContext";
import { FirebaseContext } from "../contexts/FirebaseContext";
import { useNavigate } from "react-router";

function SignUp() {
    const { loading, error } = useSelector((state) => state.auth);
    const { register, handleSubmit } = useForm();
    const { sb, setSB, openSnackBar, setOpenSnackBar } =
        useContext(SnackBarContext);
    const { signup } = useContext(FirebaseContext);
    const navigate = useNavigate();

    const handleCloseSnackBar = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setOpenSnackBar(false);
    };

    const submitForm = async (data) => {
        // check if passwords match
        if (data.password !== data.confirmPassword) {
            setSB({ msg: "Password mismatched", severity: "error" });
            setOpenSnackBar(true);
            return;
        }
        // check further information about password
        else if (
            /\d/.test(data.password) === false ||
            /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(data.password) ===
                false
        ) {
            setSB({
                msg: "Password must have at least 1 number and 1 non-alphanumeric character",
                severity: "error",
            });
            setOpenSnackBar(true);
            return;
        }
        // transform email string to lowercase to avoid case sensitivity issues in login
        data.email = data.email.toLowerCase();
        try {
            await signup(data.username, data.email, data.password);
            setSB({ msg: "Successfully registered", severity: "success" });
            setOpenSnackBar(true);
            navigate("/");
        } catch (e) {
            console.log(e.code);
            switch (e.code) {
                case "auth/weak-password":
                    setSB({
                        msg: "Password must be at least 6 characters",
                        severity: "error",
                    });
                    break;
                case "auth/email-already-in-use":
                    setSB({
                        msg: "Email is already in use",
                        severity: "error",
                    });
                    break;
                default:
                    setSB({ msg: "An error occured", severity: "error" });
                    break;
            }
            setOpenSnackBar(true);
        }
    };

    return (
        <section>
            <SnackBar
                msg={sb.msg}
                handleCloseSnackBar={handleCloseSnackBar}
                openSnackBar={openSnackBar}
                severity={sb.severity}
            />
            <div className="signup-container">
                <div className="col-2">
                    <img src={bgimage} alt="" />
                </div>

                <div className="col-1">
                    <h2>Sign Up</h2>
                    <span>Get yourself prepared for Tech Interview</span>

                    <form
                        id="form"
                        className="flex flex-col"
                        onSubmit={handleSubmit(submitForm)}
                    >
                        {error && <div>{error}</div>}
                        <input
                            type="text"
                            placeholder="Username"
                            className="form-input"
                            {...register("username")}
                            required
                        />
                        <input
                            type="email"
                            placeholder="Email Address"
                            className="form-input"
                            {...register("email")}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            className="form-input"
                            {...register("password")}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            className="form-input"
                            {...register("confirmPassword")}
                            required
                        />

                        <button
                            type="submit"
                            className="button"
                            disabled={loading}
                        >
                            {loading ? <LoadingIcon /> : "Sign Up"}
                        </button>
                        <div className="forgot-password">
                            <div>
                                Already have an account? Click{" "}
                                <span onClick={() => navigate("login")}>
                                    here!
                                </span>
                            </div>
                            Lost Password? Click <span>here!</span>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}
export default SignUp;
