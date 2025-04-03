import React, { useContext, useState } from "react";
import { Box, IconButton, Menu, MenuItem, Typography, useTheme } from "@mui/material";
import { ColorModeContext, tokens } from "../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { useDispatch } from "react-redux";
import { logout } from "../redux/reducer/authReducer";
import { useNavigate } from "react-router-dom";
import { PageTitleContext } from "../context/PageTitleContext"; // Import Context

function TopBar() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const colorMode = useContext(ColorModeContext);
    const { pageTitle } = useContext(PageTitleContext); // Lấy tiêu đề trang
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate("/"); // Chuyển hướng về trang đăng nhập
        handleClose();
    };

    const handleProfile = () => {
        navigate("/profile"); // Điều hướng đến trang hồ sơ người dùng
        handleClose();
    };

    return (
        <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>

            {/* Tiêu đề trang */}
            <Typography variant="h3" fontWeight="bold">
                {pageTitle}
            </Typography>

            {/* Icons */}
            <Box display="flex">
                <IconButton onClick={colorMode.toggleColorMode}>
                    {theme.palette.mode === "dark" ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
                </IconButton>
                <IconButton>
                    <NotificationsOutlinedIcon />
                </IconButton>
                <IconButton>
                    <SettingsOutlinedIcon />
                </IconButton>
                <IconButton onClick={handleClick}>
                    <PersonOutlinedIcon />
                </IconButton>
            </Box>

            {/* Dropdown Menu */}
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                <MenuItem onClick={handleProfile}>
                    <Typography variant="h5">Thông tin cá nhân</Typography>
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                    <Typography variant="h5" color="error">Đăng xuất</Typography>
                </MenuItem>
            </Menu>
        </Box>
    );
}

export default TopBar;
