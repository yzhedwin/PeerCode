import React, { useContext } from "react";
import "../css/signup.scss";
import bgimage from "../assets/PeerPrep.png";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import LoadingIcon from "../components/common/LoadingIcon";
import { registerUser } from "../components/auth/authActions";
import { SnackBarContext } from "../contexts/SnackBarContext";
import { useNavigate } from "react-router";

function SignUp() {
  const { loading, userInfo, error, success } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();
  const { setSB, setOpenSnackBar } = useContext(SnackBarContext);
  const navigate = useNavigate();

  const submitForm = (data) => {
    // check if passwords match
    if (data.password !== data.confirmPassword) {
      setSB({ msg: "Password mismatched", severity: "error" });
      setOpenSnackBar(true);
    }
    setSB({ msg: "Successfully registered", severity: "success" });
    setOpenSnackBar(true);
    // transform email string to lowercase to avoid case sensitivity issues in login
    data.email = data.email.toLowerCase();
    dispatch(registerUser(data));
  };

  return (
    <section>
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

            <button type="submit" className="button" disabled={loading}>
              {loading ? <LoadingIcon /> : "Sign Up"}
            </button>
            <div className="forgot-password">
              <div>
                Already have an account? Click{" "}
                <span onClick={() => navigate("login")}>here!</span>
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
