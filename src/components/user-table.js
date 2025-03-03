import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, Paper, useTheme } from "@mui/material";
import { exportToExcel } from "../utils/export-excel";
import { tokens } from "../theme";
import axios from "../apis/axios";
import { useDispatch } from "react-redux";
import {createUser, updateUser} from "../redux/reducer/userReducer";
import { useNotification } from "../snackbar/NotificationContext";
import {utilUserUpdate} from "../screen/dashboard/team";

import { MenuItem, Select } from "@mui/material";

export const handleRoleChange = async (userId, newRole, dispatch, showNotification) => {
    try {
        const res = await axios.put(`/users/adminUpdateUser/${userId}`, { role: newRole });

        if (res.status === 200) {
            dispatch(updateUser({ _id: userId, role: newRole }));
            showNotification("Cập nhật quyền thành công", "success");
        }
    } catch (error) {
        showNotification("Lỗi khi cập nhật quyền", "error");
    }
};

const getColumns = (dispatch, showNotification) => [
    { field: "_id", headerName: "ID", width: 80 },
    { field: "name", headerName: "Họ và tên", width: 180, editable: true },
    { field: "email", headerName: "Email", width: 200 },
    { field: "password", headerName: "Mật khẩu", width: 200, editable: true },
    { field: "phoneNumber", headerName: "Số điện thoại", width: 100 },
    { field: "address", headerName: "Địa chỉ", width: 200 },
    { field: "point", headerName: "Điểm thưởng", width: 100, editable: true },
    { field: "balance", headerName: "Số dư", width: 100, editable: true },
    {
        field: "role",
        headerName: "Chức năng",
        width: 150,
        renderCell: (params) => (
            <Select
                value={params.value}
                onChange={(event) => handleRoleChange(params.row._id, event.target.value, dispatch, showNotification)}
                sx={{ width: "100%"}}
                variant="filled"
            >
                <MenuItem value={0}>Người dùng</MenuItem>
                <MenuItem value={1}>Nhân viên</MenuItem>
                <MenuItem value={2}>Admin</MenuItem>
            </Select>
        )
    }
];

export default function DataTable({
                                      isLoading, rows,
                                      pageSize, setPageSize,
                                      page, setPage,
                                      rowCount, handleOpenAddUser
                                  }) {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const dispatch = useDispatch();
    const showNotification = useNotification();

    // Xử lý cập nhật dữ liệu trực tiếp trong bảng
    const handleProcessRowUpdate = async (newRow, oldRow) => {
        try {
            const changedFields = Object.keys(newRow).filter(
                (key) => newRow[key] !== oldRow[key]
            );

            if (changedFields.length === 0) {
                showNotification("Không có dữ liệu nào thay đổi", "error");
                return oldRow;
            }

            const updatedData = changedFields.reduce((acc, key) => {
                acc[key] = newRow[key];
                return acc;
            }, {});

            const res = await axios.put(`/users/adminUpdateUser/${newRow._id}`, updatedData);

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
                height: "500px",
                width: "90%",
                maxWidth: "1200px",
                padding: 4,
                background: colors.primary[400],
                margin: "auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
            }}
        >
            <Box display="flex" justifyContent="space-between" width="100%">
                <Button variant="contained" color="primary" onClick={handleOpenAddUser} sx={{ marginBottom: 2 }}>
                    Thêm Người Dùng
                </Button>
                <Button variant="contained" color="primary" onClick={() => exportToExcel(rows)} sx={{ marginBottom: 2 }}>
                    Xuất Excel
                </Button>
            </Box>
            <DataGrid
                rows={rows}
                hideFooterSelectedRowCount={true}
                loading={isLoading}
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