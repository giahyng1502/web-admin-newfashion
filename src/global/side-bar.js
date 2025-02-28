import { useState } from "react";
import {Sidebar, Menu, MenuItem, SubMenu} from 'react-pro-sidebar';
import { Link } from 'react-router-dom';
import {Box, colors, IconButton, Typography, useTheme} from "@mui/material";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import { tokens } from "../theme";

const SidebarItem = ({ title, to, icon, selected, setSelected, children, colors }) => {
    if (children && children.length > 0) {
        return (
            <SubMenu label={title} icon={icon} style={{ color: colors.grey[100] }}>
                {children.map((child) => (
                    <MenuItem
                        active={child.selected === title}
                        style={{
                            color: selected === child.title ? "#ffffff" : colors.grey[100],
                            backgroundColor: selected === child.title ? colors.primary[600] : colors.primary[400],
                        }}
                        onClick={() => setSelected(child.title)}
                        icon={child.icon}
                        component={<Link to={to}>{child.title}</Link>}
                    >
                        <Typography>{child.title}</Typography>
                    </MenuItem>
                ))}
            </SubMenu>
        );
    }
    return (
        <MenuItem
            active={selected === title}
            style={{
                color: selected === title ? "#ffffff" : colors.grey[100],
                backgroundColor: selected === title ? colors.primary[600] : "transparent",
            }}
            onClick={() => setSelected(title)}
            icon={icon}
            component={<Link to={to}>{title}</Link>}
        >
            <Typography>{title}</Typography>
        </MenuItem>
    );
};

const MySidebar = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [selected, setSelected] = useState("Dashboard");

    return (
        <Sidebar collapsed={isCollapsed} backgroundColor={colors.primary[400]}>
            <Menu
                menuItemStyles={{
                    button: {
                        [`&.active`]: {
                            backgroundColor: colors.primary[400],
                            color: "#6870fa",
                        },
                        '&:hover': {
                            backgroundColor: colors.primary[600],
                            color: "#868dfb",
                        },
                    },
                }}
            >
                <MenuItem
                    icon={<MenuOutlinedIcon />}
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    <Typography variant="h6">Menu</Typography>
                </MenuItem>

                <SidebarItem
                    colors={colors}
                    title="Dashboard"
                    to="/"
                    icon={<HomeOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                    children={[
                        {
                            title: "Sub Dashboard",
                            to: "/sub-dashboard",
                            icon: <PeopleOutlinedIcon />,
                        }
                    ]}
                />

                <SidebarItem colors={colors} title="product" to="/product" icon={<PeopleOutlinedIcon />} selected={selected} setSelected={setSelected} />
                <SidebarItem colors={colors} title="order" to="/orders" icon={<ContactsOutlinedIcon />} selected={selected} setSelected={setSelected} />
                <SidebarItem colors={colors} title="team" to="/team" icon={<ReceiptOutlinedIcon />} selected={selected} setSelected={setSelected} />
            </Menu>
        </Sidebar>
    );
};

export default MySidebar;