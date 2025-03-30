import { useState } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Link } from "react-router-dom";
import { Typography, useTheme } from "@mui/material";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import { tokens } from "../theme";
import {DiscountOutlined} from "@mui/icons-material"; // Nếu bạn có theme

const SidebarItem = ({ title, to, icon, selected, setSelected, children, colors }) => {
    if (children && children.length > 0) {
        return (
            <SubMenu
                label={title}
                icon={icon}
                style={{ color: colors.grey[100],backgroundColor: colors.primary[400] }}
            >
                {children.map((child, index) => (
                    <MenuItem
                        key={index}
                        active={selected === child.title}
                        style={{
                            color: colors.grey[100],
                            backgroundColor: selected === child.title ? colors.primary[600] : colors.primary[400],
                        }}
                        onClick={() => setSelected(child.title)}
                        icon={child.icon}
                        component={<Link to={child.to} />}
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
                color: colors.grey[100],
                backgroundColor: selected === title ? colors.primary[500] : "transparent",
            }}
            onClick={() => setSelected(title)}
            icon={icon}
            component={<Link to={to} />}
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
                    icon={isCollapsed ? <MenuOutlinedIcon /> : <CloseOutlinedIcon />}
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                </MenuItem>

                <SidebarItem
                    colors={colors}
                    title="Thống Kê"
                    to="/"
                    icon={<HomeOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                />

                <SidebarItem
                    colors={colors}
                    title="Sản Phẩm"
                    to="/product"
                    icon={<PeopleOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                    children={[
                        { title: "Danh Sách Sản Phẩm", to: "/product", icon: <PeopleOutlinedIcon /> },
                        { title: "Thêm Sản Phẩm", to: "/product/add", icon: <PeopleOutlinedIcon /> },
                    ]}
                />
                <SidebarItem
                    colors={colors}
                    title="Sản phẩm khuyễn mãi"
                    to="/saleProduct"
                    icon={<PeopleOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                />
                <SidebarItem
                    colors={colors}
                    title="Thể Loại Sản Phẩm"
                    to="/category"
                    icon={<PeopleOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                />
                <SidebarItem
                    colors={colors}
                    title="Quản Lý Đặt Hàng"
                    to="/orders"
                    icon={<ContactsOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                />
                <SidebarItem
                    colors={colors}
                    title="Quản Lý Người Dùng"
                    to="/user"
                    icon={<ReceiptOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                />

                <SidebarItem
                    colors={colors}
                    title="Quản lý bài viết"
                    to="/news"
                    icon={<ReceiptOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                />
                <SidebarItem
                    colors={colors}
                    title="Quản lý phiếu giảm giá"
                    to="/voucher"
                    icon={<DiscountOutlined />}
                    selected={selected}
                    setSelected={setSelected}
                />
            </Menu>
        </Sidebar>
    );
};

export default MySidebar;
