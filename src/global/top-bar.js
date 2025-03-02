import React, { useContext, useState } from "react";
import { Box, IconButton, InputBase, useTheme, Menu, MenuItem, Typography } from "@mui/material";
import { ColorModeContext, tokens } from "../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { useDispatch } from "react-redux";
import { logout } from "../redux/reducer/authReducer";
import { useNavigate } from "react-router-dom";

function TopBar() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const colorMode = useContext(ColorModeContext);
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
        <Box display="flex" justifyContent="space-between" p={2}>
            {/* Search Bar */}
            <Box display="flex" borderRadius="8px" p={1} backgroundColor={colors.primary[400]}>
                <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search..." />
                <IconButton sx={{ p: 1 }}>
                    <SearchIcon />
                </IconButton>
            </Box>

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
