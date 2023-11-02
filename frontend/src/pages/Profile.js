import React, { useContext, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "../css/profile.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import dpimage from "../assets/test_dp.jpeg";
import actimage from "../assets/test_activity.png";
import SnackBar from "../components/common/SnackBar";
import RecentTable from "../components/services/RecentTable";
import UpdateProfile from "./UpdateProfile";
import { SnackBarContext } from "../contexts/SnackBarContext";
import { FirebaseContext } from "../contexts/FirebaseContext";

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);
  const { sb, setSB, openSnackBar, setOpenSnackBar } =
    useContext(SnackBarContext);
  const { currentName, currentUser, image, checkDetails } =
    useContext(FirebaseContext);

  useEffect(() => {
    checkDetails(currentUser); //.then(setLoading(false));
  });

  const handleCloseSnackBar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
  };

  return (
    // <div>
    //   <figure>{userInfo?.firstName?.charAt(0).toUpperCase()}</figure>
    //   <span>
    //     Welcome <strong>{userInfo?.firstName}!</strong> You can view this page
    //     because you're logged in
    //   </span>
    // </div>
    <div className="profile">
      {/* <SnackBar
        msg={sb.msg}
        handleCloseSnackBar={handleCloseSnackBar}
        openSnackBar={openSnackBar}
        severity={sb.severity}
      /> */}
      {!loading ? (
        <div id="top-container">
          <div id="left-container" className="subcontainer">
            <div className="left-content">
              <div className="edit-icon">
                <UpdateProfile></UpdateProfile>
              </div>
              <img className="display-pic" src={image}></img>
              <div className="username">{currentName}</div>
            </div>
          </div>
          <div id="right-container" className="subcontainer">
            <RecentTable></RecentTable>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
      <div id="bottom-container" className="subcontainer">
        Activity page to be placed here
      </div>
    </div>
  );
};

export default Profile;
