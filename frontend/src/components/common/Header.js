import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate } from "react-router-dom";
import { useCallback, useContext, useState } from "react";
import axios from "axios";
import { SnackBarContext } from "../../contexts/SnackBarContext";
import { ModeContext } from "../../contexts/ModeContext";
import { FirebaseContext } from "../../contexts/FirebaseContext";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useTheme } from "@mui/material";
import SvgIcon from "@mui/material/SvgIcon";
import { useGetUserDetailsQuery } from "../services/Auth";
import { API_GATEWAY } from "../../utils/constants";

function Header() {
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const { setOpenSnackBar, setSB } = useContext(SnackBarContext);
    //eslint-disable-next-line
    const { mode, setMode } = useContext(ModeContext);
    const { currentUser, log_out, image, isAdmin } =
        useContext(FirebaseContext);
    const navigate = useNavigate();
    const theme = useTheme();
    let settings = [];
    if (isAdmin) {
        settings = ["Profile", "Get Question", "Logout"];
    } else {
        settings = ["Profile", "Logout"];
    }
    // automatically authenticate user if token is found
    //eslint-disable-next-line
    const { data, isFetching } = useGetUserDetailsQuery("userDetails", {
        pollingInterval: 900000, // 15mins
    });

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = (e) => {
        navigate(e.target.textContent);
        setAnchorElNav(null);
    };
    const handleCloseUserMenu = useCallback(async (setting) => {
        setAnchorElUser(null);
        if (typeof setting === "string") {
            if (setting?.toLowerCase() === "get question") {
                try {
                    await axios.post(
                        API_GATEWAY + "/api/v1/question/leetcode"
                    );
                    setSB({
                        msg: "Retrieve question from Leetcode",
                        severity: "success",
                    });
                    setOpenSnackBar(true);
                } catch (e) {
                    setSB({
                        msg: `Question Service: ${e.message}`,
                        severity: "error",
                    });
                    setOpenSnackBar(true);
                }
            } else {
                navigate(setting?.toLowerCase());
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const toggleColorMode = () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
    };
    return (
        <AppBar position="static" color="secondary">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <SvgIcon
                        sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            enableBackground="new 0 0 25 25"
                            viewBox="0 0 25 25"
                            id="leetcode"
                        >
                            <path
                                fill="#DE002A"
                                d="M20.803,17.047h-9.561c-1.212,0-2.197-1.027-2.197-2.29s0.985-2.29,2.197-2.29h9.561c1.212,0,2.197,1.027,2.197,2.29S22.015,17.047,20.803,17.047z M11.242,14.467c-0.093,0-0.197,0.124-0.197,0.29s0.104,0.29,0.197,0.29h9.561c0.093,0,0.197-0.124,0.197-0.29s-0.104-0.29-0.197-0.29H11.242z"
                            ></path>
                            <path
                                fill="#583689"
                                d="M12.118,25c-1.74,0-3.236-0.584-4.325-1.689L3.695,19.13C2.603,18.02,2,16.451,2,14.715c0-1.71,0.602-3.265,1.695-4.376l9.519-9.681c0.85-0.864,2.349-0.847,3.219,0.036c0.885,0.9,0.899,2.347,0.033,3.226l-1.277,1.317c0.46,0.259,0.88,0.579,1.254,0.955l2.467,2.534c0.859,0.875,0.843,2.321-0.041,3.221c-0.439,0.447-1.022,0.694-1.641,0.694l0,0c-0.6,0-1.158-0.234-1.576-0.658l-2.529-2.486c-0.23-0.234-0.568-0.347-1.017-0.347c-0.468,0-0.811,0.107-1.019,0.319l-4.065,4.192c-0.314,0.32-0.38,0.748-0.38,1.052c0,0.447,0.137,0.843,0.375,1.085l4.085,4.184c0.216,0.22,0.555,0.333,1.004,0.333c0.448,0,0.786-0.112,1.004-0.335l2.555-2.511c0.403-0.411,0.961-0.646,1.56-0.646c0,0,0.001,0,0.002,0c0.618,0,1.201,0.247,1.643,0.695c0.884,0.898,0.899,2.345,0.037,3.224l-2.456,2.523C15.348,24.386,13.812,25,12.118,25z M14.79,2c-0.061,0-0.11,0.021-0.15,0.061l-9.519,9.681C4.388,12.487,4,13.516,4,14.715c0,1.208,0.398,2.278,1.121,3.013l0.001,0.001l4.097,4.18C9.922,22.622,10.925,23,12.118,23c1.169,0,2.173-0.392,2.901-1.133l2.455-2.523c0.105-0.107,0.089-0.3-0.032-0.423c-0.083-0.084-0.171-0.098-0.217-0.098l0,0c-0.059,0.001-0.108,0.021-0.146,0.06l-2.555,2.511c-0.587,0.599-1.428,0.922-2.419,0.922s-1.833-0.323-2.433-0.934l-4.085-4.184c-0.609-0.62-0.946-1.503-0.946-2.484c0-0.956,0.337-1.826,0.949-2.449l4.065-4.192c0.594-0.604,1.439-0.922,2.449-0.922c0.991,0,1.831,0.322,2.431,0.933l2.53,2.486c0.052,0.052,0.102,0.072,0.161,0.072l0,0c0.045,0,0.132-0.013,0.215-0.097c0.122-0.124,0.139-0.316,0.036-0.42l-2.462-2.53c-0.49-0.492-1.109-0.84-1.784-0.998c-0.351-0.082-0.646-0.35-0.747-0.695S12.46,5.179,12.711,4.92l2.325-2.398c0.108-0.109,0.092-0.302-0.029-0.425C14.924,2.013,14.836,2,14.79,2z"
                            ></path>
                        </svg>
                    </SvgIcon>
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        onClick={() => navigate("dashboard")}
                        sx={{
                            mr: 2,
                            display: { xs: "none", md: "flex" },
                            fontFamily: "monospace",
                            fontWeight: 700,
                            letterSpacing: ".3rem",
                            color: "inherit",
                            textDecoration: "none",
                            cursor: "pointer",
                        }}
                    >
                        PeerCode
                    </Typography>
                    <IconButton
                        sx={{ ml: 1 }}
                        onClick={toggleColorMode}
                        color="inherit"
                    >
                        {theme.palette.mode === "dark" ? (
                            <Brightness7Icon />
                        ) : (
                            <Brightness4Icon />
                        )}
                    </IconButton>
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: { xs: "flex", md: "none" },
                        }}
                    >
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "left",
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "left",
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: "block", md: "none" },
                            }}
                        ></Menu>
                    </Box>
                    <SvgIcon
                        sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            enableBackground="new 0 0 25 25"
                            viewBox="0 0 25 25"
                            id="leetcode"
                        >
                            <path
                                fill="#DE002A"
                                d="M20.803,17.047h-9.561c-1.212,0-2.197-1.027-2.197-2.29s0.985-2.29,2.197-2.29h9.561c1.212,0,2.197,1.027,2.197,2.29S22.015,17.047,20.803,17.047z M11.242,14.467c-0.093,0-0.197,0.124-0.197,0.29s0.104,0.29,0.197,0.29h9.561c0.093,0,0.197-0.124,0.197-0.29s-0.104-0.29-0.197-0.29H11.242z"
                            ></path>
                            <path
                                fill="#583689"
                                d="M12.118,25c-1.74,0-3.236-0.584-4.325-1.689L3.695,19.13C2.603,18.02,2,16.451,2,14.715c0-1.71,0.602-3.265,1.695-4.376l9.519-9.681c0.85-0.864,2.349-0.847,3.219,0.036c0.885,0.9,0.899,2.347,0.033,3.226l-1.277,1.317c0.46,0.259,0.88,0.579,1.254,0.955l2.467,2.534c0.859,0.875,0.843,2.321-0.041,3.221c-0.439,0.447-1.022,0.694-1.641,0.694l0,0c-0.6,0-1.158-0.234-1.576-0.658l-2.529-2.486c-0.23-0.234-0.568-0.347-1.017-0.347c-0.468,0-0.811,0.107-1.019,0.319l-4.065,4.192c-0.314,0.32-0.38,0.748-0.38,1.052c0,0.447,0.137,0.843,0.375,1.085l4.085,4.184c0.216,0.22,0.555,0.333,1.004,0.333c0.448,0,0.786-0.112,1.004-0.335l2.555-2.511c0.403-0.411,0.961-0.646,1.56-0.646c0,0,0.001,0,0.002,0c0.618,0,1.201,0.247,1.643,0.695c0.884,0.898,0.899,2.345,0.037,3.224l-2.456,2.523C15.348,24.386,13.812,25,12.118,25z M14.79,2c-0.061,0-0.11,0.021-0.15,0.061l-9.519,9.681C4.388,12.487,4,13.516,4,14.715c0,1.208,0.398,2.278,1.121,3.013l0.001,0.001l4.097,4.18C9.922,22.622,10.925,23,12.118,23c1.169,0,2.173-0.392,2.901-1.133l2.455-2.523c0.105-0.107,0.089-0.3-0.032-0.423c-0.083-0.084-0.171-0.098-0.217-0.098l0,0c-0.059,0.001-0.108,0.021-0.146,0.06l-2.555,2.511c-0.587,0.599-1.428,0.922-2.419,0.922s-1.833-0.323-2.433-0.934l-4.085-4.184c-0.609-0.62-0.946-1.503-0.946-2.484c0-0.956,0.337-1.826,0.949-2.449l4.065-4.192c0.594-0.604,1.439-0.922,2.449-0.922c0.991,0,1.831,0.322,2.431,0.933l2.53,2.486c0.052,0.052,0.102,0.072,0.161,0.072l0,0c0.045,0,0.132-0.013,0.215-0.097c0.122-0.124,0.139-0.316,0.036-0.42l-2.462-2.53c-0.49-0.492-1.109-0.84-1.784-0.998c-0.351-0.082-0.646-0.35-0.747-0.695S12.46,5.179,12.711,4.92l2.325-2.398c0.108-0.109,0.092-0.302-0.029-0.425C14.924,2.013,14.836,2,14.79,2z"
                            ></path>
                        </svg>
                    </SvgIcon>
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        onClick={() => navigate("dashboard")}
                        sx={{
                            mr: 2,
                            display: { xs: "flex", md: "none" },
                            flexGrow: 1,
                            fontFamily: "monospace",
                            fontWeight: 700,
                            letterSpacing: ".3rem",
                            color: "inherit",
                            textDecoration: "none",
                            cursor: "pointer",
                        }}
                    >
                        PeerCode
                    </Typography>
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: { xs: "none", md: "flex" },
                        }}
                    >
                        {/* {noAuthPages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                {page}
              </Button>
            ))} */}
                    </Box>

                    {currentUser ? (
                        <Box sx={{ flexGrow: 0 }}>
                            <Tooltip title="Open settings">
                                <IconButton
                                    onClick={handleOpenUserMenu}
                                    sx={{ p: 0 }}
                                >
                                    <img
                                        className="header-pic"
                                        src={image}
                                        alt="header-pic"
                                    ></img>
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{ mt: "45px" }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                {settings.map((setting) => (
                                    <MenuItem
                                        key={setting}
                                        onClick={async () =>
                                            setting.toLowerCase() === "logout"
                                                ? await log_out().then(
                                                      handleCloseUserMenu(
                                                          setting
                                                      )
                                                  )
                                                : handleCloseUserMenu(setting)
                                        }
                                    >
                                        <Typography textAlign="center">
                                            {setting}
                                        </Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                    ) : (
                        <></>
                    )}
                </Toolbar>
            </Container>
        </AppBar>
    );
}
export default Header;
