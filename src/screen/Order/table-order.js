import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Button,
  IconButton,
  InputBase,
  Paper,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { MenuItem, Select } from "@mui/material";
import { tokens } from "../../theme";
import { useNotification } from "../../snackbar/NotificationContext";
import { exportToExcel } from "../../utils/export-excel";
import { updateStatus } from "../../redux/reducer/orderReducer";
import { useState } from "react";
import OrderDetail from "./order-detail";
import { utilDatetime } from "../../utils/util-datetime";
import SearchIcon from "@mui/icons-material/Search";
import { utilVietnamDong } from "../../utils/util-vietnam-dong";

const getColumns = (dispatch, showNotification, handleOrderDetail) => [
  {
    field: " ",
    headerName: "",
    sortable: false,
    disableColumnMenu: true,
    width: 100,
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
    field: "dateCreated",
    headerName: "Thời gian",
    width: 120,
    renderCell: (params) => (
      <Box sx={{ whiteSpace: "normal", wordWrap: "break-word" }}>
        {utilDatetime(params.value)}
      </Box>
    ),
  },
  {
    field: "customer",
    headerName: "Khách hàng",
    sortable: false,

    filterable: false, // vẫn để false để ngữ nghĩa
    filterOperators: [],
    width: 120,
    renderCell: (params) => (
      <Box sx={{ whiteSpace: "normal", wordWrap: "break-word" }}>
        {params.value}
      </Box>
    ),
  },
  {
    field: "shippingAddress",
    filterable: false,
    sortable: false,

    headerName: "Địa chỉ",
    width: 200,
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
    field: "phoneNumber",
    filterable: false,
    sortable: false,
    headerName: "Số điện thoại",
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
        {`${params.value}`}
      </Box>
    ),
  },
  {
    field: "totalPrice",
    headerName: "Tổng tiền",
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
        {`${utilVietnamDong(params.value)}`}
      </Box>
    ),
  },
  {
    field: "status",
    headerName: "Trạng thái",
    width: 210,
      renderCell: (params) => {
          const statusOptions = [
              { value: 0, label: "Chờ xác nhận", color: "#FFC107" },
              { value: 1, label: "Chờ giao hàng", color: "#2196F3" },
              { value: 2, label: "Đang vận chuyển", color: "#673AB7" },
              { value: 3, label: "Giao hàng thành công", color: "#4CAF50" },
              { value: 4, label: "Hủy đơn hàng", color: "#F44336" },
              { value: 6, label: "Chưa thanh toán", color: "#5d6ce4" },
          ];

          const selectedStatus = statusOptions.find(
              (item) => item.value === params.value
          );
          const selectedColor = selectedStatus
              ? selectedStatus.color
              : "transparent";

          // Ẩn dropdown, chỉ hiển thị text cho trạng thái "Hủy đơn hàng" (4) và "Chưa thanh toán" (6)
          if (params.value === 4 || params.value === 6) {
              return (
                  <Typography
                      sx={{
                          fontWeight: "bold",
                          color: "white",
                          backgroundColor: selectedColor,
                          padding: "6px 12px",
                          borderRadius: "5px",
                          display: "inline-block",
                      }}
                  >
                      {selectedStatus?.label}
                  </Typography>
              );
          }

          // Lọc trạng thái hợp lệ (>= hiện tại, loại bỏ 6 và nếu >1 thì loại 4)
          let availableStatusOptions = statusOptions.filter(
              (item) =>
                  item.value >= params.value &&
                  item.value !== 6 && // Loại trừ "Chưa thanh toán"
                  !(params.value > 1 && item.value === 4) // Nếu >1 thì loại 4
          );

          return (
              <Select
                  value={params.value}
                  variant="filled"
                  onChange={(event) => {
                      const newValue = event.target.value;
                      const statusLabel = statusOptions.find((s) => s.value === newValue)?.label;

                      const confirmChange = window.confirm(
                          `Bạn có chắc chắn muốn đổi trạng thái thành "${statusLabel}"?`
                      );

                      if (confirmChange) {
                          updateStatus(
                              params.row.id,
                              newValue,
                              dispatch,
                              showNotification
                          );
                      }
                  }}
                  sx={{
                      width: "100%",
                      backgroundColor: selectedColor,
                      color: "white",
                      fontWeight: "bold",
                      borderRadius: 2,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      "& .MuiSelect-select": {
                          padding: "10px 14px",
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                          border: "none",
                      },
                      "&:hover": {
                          backgroundColor: "#444",
                      },
                      "& .MuiSvgIcon-root": {
                          color: "white",
                      },
                  }}
              >
                  {availableStatusOptions.map((item) => (
                      <MenuItem
                          key={item.value}
                          value={item.value}
                          sx={{
                              backgroundColor:
                                  params.value === item.value ? item.color : "transparent",
                              color: params.value === item.value ? "#fff" : "#ddd",
                              fontWeight: params.value === item.value ? "bold" : "normal",
                              borderRadius: 1,
                              transition: "all 0.2s ease",
                              "&:hover": {
                                  backgroundColor: item.color,
                                  color: "white",
                                  transform: "scale(1.02)",
                              },
                          }}
                      >
                          {item.label}
                      </MenuItem>
                  ))}
              </Select>

          );
      }
  },
];

export default function TableOrder({
  isLoading,
  rows,
  pageSize,
  setPageSize,
  page,
  setPage,
  sortModel,
  rowCount,
  setSearch,
  setSortModel,
}) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();
  const showNotification = useNotification();
  const [orderDetailDialog, setOrderDetailDialog] = useState(false);
  const [orderSelected, setSelectedOrder] = useState({});
  const [value, setValue] = useState("");
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
          height: "550px",
          width: "96%",
          maxWidth: "1200px",
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
          <Box
            display="flex"
            borderRadius="8px"
            p={1}
            mb={2}
            backgroundColor={colors.primary[500]}
          >
            <InputBase
              sx={{ ml: 2, flex: 1 }}
              placeholder="Search..."
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setSearch(value); // Thực hiện tìm kiếm khi nhấn Enter
                }
              }}
            />
            <IconButton sx={{ p: 1 }} onClick={() => setSearch(value)}>
              <SearchIcon />
            </IconButton>
          </Box>

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
          disableColumnMenu={true}
          rows={rows}
          hideFooterSelectedRowCount={true}
          loading={isLoading}
          rowCount={rowCount}
          sortingMode="server"
          sortModel={sortModel}
          onSortModelChange={(model) => {
            console.log(model);
            if (model.length > 0) {
              setSortModel(model);
            } else {
              setSortModel([{ field: "dateCreated", sort: "desc" }]); // Mặc định sắp xếp theo ngày tạo mới nhất
            }
          }}
          filterMode="server"
          disableColumnResize={true}
          pageSizeOptions={[5, 10, 20, 50, 100]}
          paginationModel={{ page, pageSize }}
          paginationMode="server"
          onPaginationModelChange={(model) => {
            setPage(model.page);
            setPageSize(model.pageSize);
          }}
          columns={getColumns(dispatch, showNotification, handleOrderDetail)}
          sx={{
            width: "100%",
            "& .MuiDataGrid-columnSeparator": { display: "none" },
            "& .MuiDataGrid-root": { border: "2px solid #1976d2" },
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
