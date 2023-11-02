import React, { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import SnackBar from "../components/common/SnackBar";
import LoadingIcon from "../components/common/LoadingIcon";
import { userLogin } from "../components/auth/authActions";
import "../css/login.scss";
import bgimage from "../assets/PeerCode.png";
import { SnackBarContext } from "../contexts/SnackBarContext";
import { FirebaseContext } from "../contexts/FirebaseContext";

function Login() {
  const { loading, userInfo, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const { sb, setSB, openSnackBar, setOpenSnackBar } =
    useContext(SnackBarContext);
  const { login } = useContext(FirebaseContext);

  // redirect authenticated user to profile screen
  // useEffect(() => {
  //   if (userInfo) {
  //     console.log(userInfo);
  //     navigate("/dashboard");
  //   }
  // }, [navigate, userInfo]);

  const handleCloseSnackBar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
  };

  const submitForm = async (data) => {
    try {
      dispatch(userLogin(data));
      await login(data.email, data.password);
      navigate("/dashboard");
    } catch (e) {
      console.log(e.code);
      switch (e.code) {
        case "auth/invalid-login-credentials":
          setSB({
            msg: "Invalid login credentials",
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
      <div className="login-container">
        <div className="col-2">
          <img src={bgimage} alt="" />
        </div>

        <div className="col-1">
          <h2>Login</h2>
          <span>Get yourself prepared for Tech Interview</span>

          <form
            id="form"
            className="flex flex-col"
            onSubmit={handleSubmit(submitForm)}
          >
            <input
              type="email"
              placeholder="Email Address"
              className="form-input"
              {...register("email")}
              required
            />
            <input
              className="form-input"
              type="password"
              placeholder="Password"
              {...register("password")}
              required
            />

            <button type="submit" className="button" disabled={loading}>
              {loading ? <LoadingIcon /> : "Login"}
            </button>
            <div className="forgot-password">
              <div>
                New member? Click{" "}
                <span onClick={() => navigate("signup")}>here!</span>
              </div>
              Lost Password? Click <span>here!</span>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Login;
