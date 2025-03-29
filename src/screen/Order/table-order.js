import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, Paper, Typography, useTheme } from "@mui/material";
import { useDispatch } from "react-redux";

import { MenuItem, Select } from "@mui/material";
import { tokens } from "../../theme";
import { useNotification } from "../../snackbar/NotificationContext";
import { exportToExcel } from "../../utils/export-excel";
import { updateStatus } from "../../redux/reducer/orderReducer";
import { useState } from "react";
import OrderDetail from "./order-detail";

const getColumns = (dispatch, showNotification, handleOrderDetail) => [
  {
    headerName: "",
    width: 90,
    renderCell: (params) => (
      <Button
        variant={"contained"}
        color={"success"}
        onClick={() => {
          handleOrderDetail(params.row);
        }}
      >
        <Typography variant={"h6"}>Xem</Typography>
      </Button>
    ),
  },
  {
    field: "customer",
    headerName: "Khách hàng",
    width: 120,
    editable: true,
    renderCell: (params) => (
      <Box sx={{ whiteSpace: "normal", wordWrap: "break-word" }}>
        {params.value}
      </Box>
    ),
  },
  {
    field: "shippingAddress",
    headerName: "Địa chỉ",
    width: 150,
    renderCell: (params) => (
      <Box
        sx={{
          whiteSpace: "pre-wrap",
          wordWrap: "break-word",
          display: "block",
          p: 1,
        }}
      >
        {params.value}
      </Box>
    ),
  },
  {
    field: "productDesc",
    headerName: "Tên sản phẩm",
    width: 300,
    renderCell: (params) => (
      <Box sx={{ whiteSpace: "pre-wrap", wordWrap: "break-word", p: 1 }}>
        <text>{params.value}</text>
      </Box>
    ),
  },
  {
    field: "method",
    headerName: "Phương thức thanh toán",
    width: 100,
    renderCell: (params) => (
      <Box sx={{ whiteSpace: "pre-wrap", wordWrap: "break-word", p: 1 }}>
        <text>{params.value}</text>
      </Box>
    ),
  },
  { field: "totalPrice", headerName: "Tổng tiền", width: 100 },
  {
    field: "status",
    headerName: "Trạng thái",
    width: 210,
    renderCell: (params) => {
      // Danh sách trạng thái và màu tương ứng
      const statusOptions = [
        { value: 0, label: "Chờ xác nhận", color: "#FFC107" }, // Vàng
        { value: 1, label: "Chờ giao hàng", color: "#2196F3" }, // Xanh dương
        { value: 2, label: "Đang vận chuyển", color: "#673AB7" }, // Tím
        { value: 3, label: "Giao hàng thành công", color: "#4CAF50" }, // Xanh lá
        { value: 4, label: "Hủy đơn hàng", color: "#F44336" }, // Đỏ
        { value: 5, label: "Hoàn đơn hàng", color: "#9E9E9E" }, // Xám
      ];

      // Lấy màu tương ứng với value hiện tại
      const selectedStatus = statusOptions.find(
        (item) => item.value === params.value
      );
      const selectedColor = selectedStatus
        ? selectedStatus.color
        : "transparent";

      return (
        <Select
          value={params.value}
          sx={{
            width: "100%",
            backgroundColor: selectedColor, // Đổi màu nền của Select
            color: "white", // Chữ trắng để dễ nhìn hơn
            "& .MuiSelect-select": {
              fontWeight: "bold",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
          }}
          variant="filled"
          onChange={(event) =>
            updateStatus(
              params.row.id,
              event.target.value,
              dispatch,
              showNotification
            )
          }
        >
          {statusOptions.map((item) => (
            <MenuItem
              key={item.value}
              value={item.value}
              sx={{
                backgroundColor:
                  params.value === item.value ? item.color : "transparent",
                color: params.value === item.value ? "red" : "white",
                "&:hover": {
                  backgroundColor: item.color,
                  color: "white",
                },
              }}
            >
              {item.label}
            </MenuItem>
          ))}
        </Select>
      );
    },
  },
];

export default function TableOrder({
  isLoading,
  rows,
  pageSize,
  setPageSize,
  page,
  setPage,
  rowCount,
  handleOpenAddUser,
}) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();
  const showNotification = useNotification();
  const [orderDetailDialog, setOrderDetailDialog] = useState(false);
  const [orderSelected, setSelectedOrder] = useState({});

  const handleOrderDetail = (order) => {
    setOrderDetailDialog(true);
    setSelectedOrder(order);
  };
  return (
    <>
      <OrderDetail
        open={orderDetailDialog}
        order={orderSelected}
        setOpen={setOrderDetailDialog}
        colors={colors}
      />
      <Paper
        sx={{
          height: "85vh",
          width: "100%",
          maxWidth: "1600px",
          padding: 4,
          background: colors.primary[400],
          margin: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "auto",
        }}
      >
        <Box display="flex" justifyContent="space-between" width="100%">
          <Button
            variant="contained"
            color="primary"
            onClick={() => exportToExcel(rows)}
            sx={{ marginBottom: 2 }}
          >
            Xuất Excel
          </Button>
        </Box>
        <DataGrid
          rows={rows}
          hideFooterSelectedRowCount={true}
          loading={isLoading}
          rowCount={rowCount}
          autoPageSize
          disableColumnResize={true}
          pageSizeOptions={[5, 10, 20, 50, 100]}
          paginationModel={{ page, pageSize }}
          paginationMode="server"
          onPaginationModelChange={(model) => {
            setPage(model.page);
            setPageSize(model.pageSize);
          }}
          columns={getColumns(dispatch, showNotification, handleOrderDetail)}
          getRowHeight={() => "auto"}
          sx={{
            width: "100%",
            "& .MuiDataGrid-root": {
              border: "2px solid #1976d2",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#1976d2",
              fontWeight: "bold",
              fontSize: "16px",
            },
            "& .MuiDataGrid-cell": {
              whiteSpace: "normal",
              wordWrap: "break-word",
              lineHeight: "1.2em",
              alignContent: "center",
              display: "block",
            },
          }}
        />
      </Paper>
    </>
  );
}
