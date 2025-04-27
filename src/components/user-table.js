import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Button,
  Paper,
  Select,
  MenuItem,
  useTheme,
  TextField,
  IconButton,
  InputBase,
} from "@mui/material";
import { exportToExcel } from "../utils/export-excel";
import { tokens } from "../theme";
import axios from "../apis/axios";
import { useDispatch } from "react-redux";
import { getData, updateUser } from "../redux/reducer/userReducer";
import { useNotification } from "../snackbar/NotificationContext";
import { utilUserUpdate } from "../screen/dashboard/team";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";
import { utilDatetime } from "../utils/util-datetime";

const handleRoleChange = async (
  userId,
  newRole,
  dispatch,
  showNotification
) => {
  try {
    const res = await axios.put(`/users/adminUpdateUser/${userId}`, {
      role: newRole,
    });
    if (res.status === 200) {
      dispatch(updateUser({ _id: userId, role: newRole }));
      showNotification("Cập nhật quyền thành công", "success");
    }
  } catch (error) {
    showNotification("Lỗi khi cập nhật quyền", "error");
    console.log(error)
  }
};

const getColumns = (dispatch, showNotification) => [
  { field: "_id", headerName: "ID", width: 150 },
  {
    field: "createdAt",
    headerName: "Ngày tạo",
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
        {`${utilDatetime(params.value)}`}
      </Box>
    ),
  },
  {
    field: "name",
    headerName: "Họ và tên",
    width: 180,
    editable: true,
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
  { field: "email", headerName: "Email", width: 200 },
  { field: "point", headerName: "Điểm thưởng", width: 150, editable: true },
  {
    field: "role",
    headerName: "Vai trò",
    width: 150,
    renderCell: (params) => {
      const isAdmin = params.value === 2; // Kiểm tra nếu là Admin
      return (
        <Select
          value={params.value}
          onChange={(event) =>
            handleRoleChange(
              params.row._id,
              event.target.value,
              dispatch,
              showNotification
            )
          }
          sx={{ width: "100%" }}
          variant="filled"
          disabled={isAdmin} // Nếu là Admin thì không thể thay đổi
        >
          <MenuItem value={0}>Người dùng</MenuItem>
          <MenuItem value={1}>Nhân viên</MenuItem>
          <MenuItem value={2}>Admin</MenuItem>
        </Select>
      );
    },
  },
];

export default function DataTable({
  setSearch,
  setSortModel,
  sortModel,
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
  const [value, setValue] = useState("");
  const showNotification = useNotification();

  const handleProcessRowUpdate = async (newRow, oldRow) => {
    try {
      const changedFields = Object.keys(newRow).filter(
        (key) => newRow[key] !== oldRow[key]
      );
      if (changedFields.length === 0) {
        showNotification("Không có dữ liệu nào thay đổi", "error");
        return oldRow;
      }

      const isConfirmed = window.confirm(
        "Bạn có chắc chắn muốn cập nhật số liệu này không?"
      );

      if (!isConfirmed) {
        return oldRow;
      }

      const updatedData = changedFields.reduce((acc, key) => {
        acc[key] = newRow[key];
        return acc;
      }, {});

      const res = await axios.put(
        `/users/adminUpdateUser/${newRow._id}`,
        updatedData
      );
      if (res.status === 200) {
        const data = utilUserUpdate(res.data.user);
        dispatch(updateUser(data));
        showNotification("Cập nhật người dùng thành công", "success");
        return data;
      }
    } catch (error) {
      showNotification("Lỗi khi cập nhật người dùng", "error");
    }
    return oldRow;
  };

  return (
    <Paper
      sx={{
        height: "550px",
        width: "96%",
        maxWidth: "1200px",
        padding: 2,
        background: colors.primary[400],
        margin: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        borderRadius="8px"
        width="100%"
        justifyContent="flex-start" // Căn trái
      >
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
      </Box>
      <Box display="flex" justifyContent="space-between" width="100%">
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenAddUser}
          sx={{ marginBottom: 2 }}
        >
          Thêm Người Dùng
        </Button>
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
        hideFooterSelectedRowCount
        loading={isLoading}
        disableColumnFilter
        disableColumnMenu
        sortingMode="server"
        sortModel={sortModel}
        onSortModelChange={(model) => {
          if (model.length > 0) {
            setSortModel(model);
          } else {
            setSortModel([{ field: "createdAt", sort: "desc" }]); // Mặc định sắp xếp theo ngày tạo mới nhất
          }
        }}
        rowCount={rowCount}
        pageSizeOptions={[5, 10, 20, 50, 100]}
        paginationModel={{ page, pageSize }}
        paginationMode="server"
        onPaginationModelChange={(model) => {
          setPage(model.page);
          setPageSize(model.pageSize);
        }}
        columns={getColumns(dispatch, showNotification)}
        processRowUpdate={handleProcessRowUpdate}
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
        }}
      />
    </Paper>
  );
}
