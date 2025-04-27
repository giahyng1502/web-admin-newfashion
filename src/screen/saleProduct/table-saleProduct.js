import {
  Box,
  Button,
  IconButton,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import { tokens } from "../../theme";
import { useDispatch } from "react-redux";
import { useNotification } from "../../snackbar/NotificationContext";
import React, { useState } from "react";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { utilVietnamDong } from "../../utils/util-vietnam-dong";
import { DataGrid } from "@mui/x-data-grid";
import { exportToExcel } from "../../utils/export-excel";
import DeleteIcon from "@mui/icons-material/Close";
import axios from "../../apis/axios";
import { utilDatetime } from "../../utils/util-datetime";
import ComfirmDelete from "../../dialogs/comfirm-delete";

export default function TableSaleProduct({
  isLoading,
  rows,
  setRows,
  pageSize,
  setPageSize,
  page,
  setPage,
  rowCount,
  handleOpenAddUser,
}) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const showNotification = useNotification();
  const [isShowDialog, setIsShowDialog] = useState(false);
  const [seletedSaleProduct, setSeletedSaleProduct] = useState({});
  const handleRowUpdate = async (newRow, oldRow) => {
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
        `/saleProduct/update/${newRow.id}`,
        updatedData
      );
      if (res.status === 200) {
        showNotification("Cập nhật sản phẩm thành công", "success");
        return newRow;
      }
    } catch (error) {
      showNotification("Lỗi khi cập nhật sản phẩm", "error");
    }
    return oldRow;
  };
  const handleDelete = async () => {
    try {
      const res = await axios.delete(
        `/saleProduct/delete/${seletedSaleProduct.id}`
      );
      if (res.status === 200) {
        showNotification("Xóa sản phẩm thành công", "success");
        setIsShowDialog(false);
      }
    } catch (error) {
      showNotification("Xóa sản thất bại", "error");
      setIsShowDialog(false);
      console.log(error);
    }
  };
  const showDialogActions = (row) => {
    setIsShowDialog(true);
    setSeletedSaleProduct(row);
  };
  const getColumns = () => [
    { field: "ID", headerName: "id" },
    { field: "productId", headerName: "Mã sản phẩm", width: 120 },
    {
      field: "name",
      headerName: "Tên sản phẩm",
      width: 380,
      renderCell: (params) => (
        <Box sx={{ whiteSpace: "pre-wrap", wordWrap: "break-word", p: 1 }}>
          <Typography>{params.value}</Typography>
        </Box>
      ),
    },
    {
      field: "price",
      headerName: "Giá gốc",
      width: 100,
      renderCell: (params) => (
        <Box
          sx={{ textAlign: "center", height: "100%", alignContent: "center" }}
        >
          <Typography>{utilVietnamDong(params.value)}</Typography>
        </Box>
      ),
    },
    {
      field: "priceSale",
      headerName: "Giá giảm",
      width: 100,
      renderCell: (params) => (
        <Box
          sx={{ textAlign: "center", height: "100%", alignContent: "center" }}
        >
          <Typography>{utilVietnamDong(params.value)}</Typography>
        </Box>
      ),
    },
    {
      field: "discount",
      headerName: "Giảm",
      width: 100,
      editable: true,
      renderCell: (params) => (
        <Box
          sx={{ textAlign: "center", height: "100%", alignContent: "center" }}
        >
          <Typography>{params.value}%</Typography>
        </Box>
      ),
    },
    {
      field: "limit",
      headerName: "Giới hạn",
      width: 100,
      editable: true,
      renderCell: (params) => (
        <Box
          sx={{ textAlign: "center", height: "100%", alignContent: "center" }}
        >
          <Typography>{params.value}</Typography>
        </Box>
      ),
    },
    {
      field: "expireAt",
      headerName: "Hết hạn",
      editable: true,
      width: 150,
      renderCell: (params) => (
        <Box
          sx={{ textAlign: "center", height: "100%", alignContent: "center" }}
        >
          <Typography>{params.value}</Typography>
        </Box>
      ),
    },
    {
      field: "action",
      headerName: "Hành động",
      width: 80,
      renderCell: (params) => (
        <Box>
          <IconButton onClick={() => showDialogActions(params.row)}>
            <DeleteIcon color={"error"} />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <>
      <ComfirmDelete
        open={isShowDialog}
        colors={colors}
        title={"Bạn có chắc chắn muốn xóa sản phẩm giảm giá này không"}
        onDelete={handleDelete}
        onClose={() => {
          setIsShowDialog(false);
        }}
      />
      <Paper
        sx={{
          height: "80vh",
          width: "96%",
          maxWidth: "1200px",
          padding: 4,
          backgroundColor: colors.primary[400],
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
          sx={{ width: "100%" }}
          columns={getColumns()}
          processRowUpdate={handleRowUpdate}
          columnVisibilityModel={{ ID: false }} // Ẩn cột ID
        />
      </Paper>
    </>
  );
}
