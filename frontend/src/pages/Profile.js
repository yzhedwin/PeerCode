import React, { useContext, useState, useEffect } from "react";
import "../css/profile.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import SnackBar from "../components/common/SnackBar";
import RecentTable from "../components/services/RecentTable";
import UpdateProfile from "./UpdateProfile";
import { SnackBarContext } from "../contexts/SnackBarContext";
import { FirebaseContext } from "../contexts/FirebaseContext";
import { PersonFill, EnvelopeFill } from "react-bootstrap-icons";
import { API_GATEWAY } from "../utils/constants";

import axios from "axios";

const Profile = () => {
    const [loading, setLoading] = useState(false);
    const [rowData, setRowData] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const { sb, openSnackBar, setOpenSnackBar } = useContext(SnackBarContext);
    const { currentName, currentUser, image, checkDetails } =
        useContext(FirebaseContext);

    useEffect(() => {
        checkDetails(currentUser); //.then(setLoading(false));
        axios
            .get(
                API_GATEWAY + `/api/v1/question/history/user?userID=${currentUser.uid}`
            )
            .then((res) => setSubmissions(res.data))
            .catch((e) => console.log("Submissions not found"));

        axios
            .get(API_GATEWAY + "/api/v1/question")
            .then((res) => setRowData(res.data));
    }, []);

    const handleCloseSnackBar = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setOpenSnackBar(false);
    };

    return (
        <div className="profile">
            <SnackBar
                msg={sb.msg}
                handleCloseSnackBar={handleCloseSnackBar}
                openSnackBar={openSnackBar}
                severity={sb.severity}
            />
            {!loading ? (
                <div id="top-container">
                    <div id="left-container" className="subcontainer">
                        <div className="left-content">
                            <div className="edit-icon">
                                <UpdateProfile></UpdateProfile>
                            </div>
                            <div className="recent-text">Profile</div>
                            <div className="left-box">
                                <img className="display-pic" src={image}></img>
                                <div className="user-info">
                                    <div className="user-element">
                                        <PersonFill size={25}></PersonFill>
                                        <div className="username">
                                            {currentName}
                                        </div>
                                    </div>
                                    <div className="user-element">
                                        <EnvelopeFill size={25}></EnvelopeFill>
                                        <div className="username">
                                            {currentUser.email}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="right-container" className="subcontainer">
                        <RecentTable
                            submissions={submissions}
                            data={rowData}
                        ></RecentTable>
                    </div>
                </div>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
};

export default Profile;
