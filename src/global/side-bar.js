import { useContext, useState } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Link } from "react-router-dom";
import { Typography, useTheme } from "@mui/material";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import {
  CategoryOutlined,
  AssessmentOutlined,
  ConfirmationNumberOutlined,
  NewspaperOutlined,
  ReceiptLongOutlined,
  ManageAccountsRounded,
  Inventory2Outlined,
  DiscountOutlined,
  AddBusinessOutlined,
  ClearAllOutlined,
} from "@mui/icons-material";
import { tokens } from "../theme";
import { PageTitleContext } from "../context/PageTitleContext"; // Nếu bạn có theme

const SidebarItem = ({
  title,
  to,
  icon,
  selected,
  setSelected,
  children,
  colors,
}) => {
  if (children && children.length > 0) {
    return (
      <SubMenu
        label={title}
        icon={icon}
        style={{
          color: colors.grey[100],
          backgroundColor: colors.primary[400],
        }}
      >
        {children.map((child, index) => (
          <MenuItem
            key={index}
            active={selected === child.title}
            style={{
              color: colors.grey[100],
              backgroundColor:
                selected === child.title
                  ? colors.primary[600]
                  : colors.primary[400],
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
        backgroundColor:
          selected === title ? colors.primary[500] : "transparent",
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
  const { setPageTitle } = useContext(PageTitleContext);
  const [selected, setSelected] = useState("Thống Kê");

  return (
    <Sidebar collapsed={isCollapsed} backgroundColor={colors.primary[400]}>
      <Menu
        menuItemStyles={{
          button: {
            [`&.active`]: {
              backgroundColor: colors.primary[400],
              color: "#6870fa",
            },
            "&:hover": {
              backgroundColor: colors.primary[600],
              color: "#868dfb",
            },
          },
        }}
      >
        <MenuItem
          icon={isCollapsed ? <MenuOutlinedIcon /> : <CloseOutlinedIcon />}
          onClick={() => setIsCollapsed(!isCollapsed)}
        ></MenuItem>

        <SidebarItem
          colors={colors}
          title="Thống Kê"
          to="/statistics"
          icon={<AssessmentOutlined />}
          selected={selected}
          setSelected={(title) => {
            setSelected(title);
            setPageTitle(title);
          }}
          children={[
            {
              title: "Doanh Thu",
              to: "/statistics",
              icon: <AssessmentOutlined />,
            },
            {
              title: "Đơn Hàng",
              to: "/statistics/order",
              icon: <ReceiptLongOutlined />,
            },
            {
              title: "Top Sản Phẩm Bán Chạy Nhất",
              to: "/statistics/product",
              icon: <Inventory2Outlined />,
            },
            {
              title: "Người Dùng",
              to: "/statistics/user",
              icon: <ManageAccountsRounded />,
            },
            {
              title: "Sản Phẩm Sắp Hết Hàng",
              to: "/statistics/low-product",
              icon: <Inventory2Outlined />,
            },
          ]}
        />

        <SidebarItem
          colors={colors}
          title="Sản Phẩm"
          to="/product"
          icon={<Inventory2Outlined />}
          selected={selected}
          setSelected={(title) => {
            setSelected(title);
            setPageTitle(title); // Cập nhật tiêu đề khi chọn
          }}
          children={[
            {
              title: "Danh Sách Sản Phẩm",
              to: "/product",
              icon: <ClearAllOutlined />,
            },
            {
              title: "Thêm Sản Phẩm",
              to: "/product/add",
              icon: <AddBusinessOutlined />,
            },
          ]}
        />
        <SidebarItem
          colors={colors}
          title="Sản phẩm khuyến mãi"
          to="/saleProduct"
          icon={<DiscountOutlined />}
          selected={selected}
          setSelected={(title) => {
            setSelected(title);
            setPageTitle(title); // Cập nhật tiêu đề khi chọn
          }}
        />
        <SidebarItem
          colors={colors}
          title="Thể Loại Sản Phẩm"
          to="/category"
          icon={<CategoryOutlined />}
          selected={selected}
          setSelected={(title) => {
            setSelected(title);
            setPageTitle(title); // Cập nhật tiêu đề khi chọn
          }}
        />
        <SidebarItem
          colors={colors}
          title="Quản Lý Đặt Hàng"
          to="/orders"
          icon={<ReceiptLongOutlined />}
          selected={selected}
          setSelected={(title) => {
            setSelected(title);
            setPageTitle(title); // Cập nhật tiêu đề khi chọn
          }}
        />
        <SidebarItem
          colors={colors}
          title="Quản Lý Người Dùng"
          to="/user"
          icon={<ManageAccountsRounded />}
          selected={selected}
          setSelected={(title) => {
            setSelected(title);
            setPageTitle(title); // Cập nhật tiêu đề khi chọn
          }}
        />

        <SidebarItem
          colors={colors}
          title="Quản lý bài viết"
          to="/news"
          icon={<NewspaperOutlined />}
          selected={selected}
          setSelected={(title) => {
            setSelected(title);
            setPageTitle(title); // Cập nhật tiêu đề khi chọn
          }}
        />
        <SidebarItem
          colors={colors}
          title="Quản lý phiếu giảm giá"
          to="/voucher"
          icon={<ConfirmationNumberOutlined />}
          selected={selected}
          setSelected={(title) => {
            setSelected(title);
            setPageTitle(title); // Cập nhật tiêu đề khi chọn
          }}
        />

          <SidebarItem
              colors={colors}
              title="Quản lý banner"
              to="/banner"
              icon={<ConfirmationNumberOutlined />}
              selected={selected}
              setSelected={(title) => {
                  setSelected(title);
                  setPageTitle(title);
              }}
          />
      </Menu>
    </Sidebar>
  );
};

export default MySidebar;
