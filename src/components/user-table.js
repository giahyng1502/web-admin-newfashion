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

const columns = [
    { field: "_id", headerName: "ID", width: 80 },
    { field: "name", headerName: "Họ và tên", width: 180, editable: true },
    { field: "email", headerName: "Email", width: 200 },
    { field: "password", headerName: "Mật khẩu", width: 200, editable: true },
    { field: "phoneNumber", headerName: "Số điện thoại", width: 100 },
    { field: "address", headerName: "Địa chỉ", width: 200 },
    { field: "point", headerName: "Điểm thưởng", width: 100, editable: true },
    { field: "balance", headerName: "Số dư", width: 100, editable: true },
    { field: "role", headerName: "Chức năng", width: 100, editable: true },
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
            // Lấy danh sách các trường đã thay đổi
            const changedFields = Object.keys(newRow).filter(
                (key) => newRow[key] !== oldRow[key]
            );

            if (changedFields.length === 0) {
                console.log("Không có thay đổi nào.");
                showNotification("Không có dự liệu nào thay đổi", "error");
                return oldRow; // Không cập nhật nếu không có thay đổi
            }

            // Chỉ gửi lên những trường đã thay đổi
            const updatedData = changedFields.reduce((acc, key) => {
                acc[key] = newRow[key];
                return acc;
            }, {});

            console.log("Dữ liệu gửi lên:", updatedData);

            const res = await axios.put(`/users/adminUpdateUser/${newRow._id}`, updatedData);

            if (res.status === 200) {
                const data = utilUserUpdate(res.data.user )
                console.log(data)
                dispatch(updateUser(data)); // Cập nhật Redux store
                showNotification("Cập nhập người dùng thành công", "success");
                return  data // Trả về dữ liệu mới để cập nhật UI

            }
        } catch (error) {
            console.error("Lỗi khi cập nhật dữ liệu:", error);
            showNotification("Lỗi dữ liệu khi cập nhập người dùng", "error");
        }

        return oldRow; // Nếu lỗi, giữ nguyên dữ liệu cũ
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
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleOpenAddUser} // Định nghĩa onClick
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
                columns={columns}
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
