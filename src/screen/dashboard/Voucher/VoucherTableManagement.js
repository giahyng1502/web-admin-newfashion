import {
  Box,
  Button,
  IconButton,
  InputBase,
  Paper,
  useTheme,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { VisibilityOutlined } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import { exportToExcel } from "../../../utils/export-excel";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { removeVoucher } from "../../../redux/voucher/voucherSlice";
import AddVoucherModal from "../../../components/AddVoucherModal";
import UpdateVoucherModal from "../../../components/UpdateVoucherModal";
import VoucherDetailModal from "../../../components/VoucherDetailModal";
import { useNotify } from "../../../hooks/useNotify";
import "./styles.scss";

export default function VoucherTableManagement({
  isLoading,
  rows,
  pageSize,
  setPageSize,
  page,
  setPage,
  rowCount,
  onRefresh,
}) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [open, setOpen] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [value, setValue] = useState("");
  const { deleteSuccess } = useNotify();

  const dispatch = useDispatch();

  const handleDeleteVoucher = (voucherId) => {
    if (window.confirm("Bạn có chắc muốn xóa voucher này không?")) {
      dispatch(removeVoucher(voucherId));
      deleteSuccess("voucher");
    }
  };

  const handleUpdateVoucher = (voucherId) => {
    const voucherIdHasFound = rows.find((v) => v._id === voucherId);
    if (voucherIdHasFound) {
      setSelectedVoucher(voucherIdHasFound);
      setOpenUpdate(true);
    }
  };

  const columns = [
    { field: "_id", headerName: "ID", width: 180 },
    { field: "voucherName", headerName: "Tên mã", width: 120 },
    { field: "voucherDetail", headerName: "Thông tin chi tiết", width: 250 },
    { field: "limit", headerName: "Số Lượng", width: 90 },
    { field: "discount", headerName: "Giảm Giá (%)", width: 115 },
    { field: "maxDiscountPrice", headerName: "Giảm giá tối đa", width: 125 },
    { field: "startDate", headerName: "Ngày bắt đầu", width: 150 },
    { field: "endDate", headerName: "Ngày kết thúc", width: 150 },
    {
      field: " ",
      width: 160,
      renderCell: ({ id }) => {
        return (
          <Box className="action-container">
            <IconButton
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteVoucher(id);
              }}
            >
              <DeleteIcon />
            </IconButton>
            <IconButton
              color="success"
              onClick={(e) => {
                e.stopPropagation();
                handleUpdateVoucher(id);
              }}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              color="default"
              onClick={(e) => {
                e.stopPropagation();
                const voucher = rows.find((v) => v._id === id);
                if (voucher) {
                  setSelectedVoucher(voucher);
                  setOpenDetail(true);
                }
              }}
            >
              <VisibilityOutlined />
            </IconButton>
          </Box>
        );
      },
    },
  ];

  return (
    <Paper
      sx={{
        height: "80vh",
        width: "96%",
        maxWidth: "1200px",
        padding: 4,
        background: colors.primary[400],
        margin: "auto",
      }}
    >
      <Box display="flex" justifyContent="space-between" width="100%">
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(true)}
          sx={{ marginBottom: 2, marginRight: 2 }}
        >
          Tạo Phiếu Giảm Giá
        </Button>
        <AddVoucherModal
          open={open}
          handleClose={() => setOpen(false)}
          onSuccess={() => {
            setOpen(false);
            onRefresh();
          }}
        />
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
        rowHeight={100}
        rowCount={rowCount}
        getRowId={(row) => row._id || row.index}
        pageSizeOptions={[5, 10, 20, 50, 100]}
        paginationModel={{ page, pageSize }}
        paginationMode="server"
        hideFooterPagination={true}
        onPaginationModelChange={(model) => {
          setPage(model.page);
          setPageSize(model.pageSize);
        }}
        columns={columns}
        pagination
        sx={{
          width: "100%",
          height: "60vh",
          "& .MuiDataGrid-root": {
            border: "2px solid #1976d2",
            userSelect: "none",
            WebkitTouchCallout: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#1976d2",
            fontWeight: "bold",
            fontSize: "16px",
          },
          "& .MuiDataGrid-row": {
            position: "relative",
            overflow: "visible",
            "& .action-container": {
              position: "absolute",
              right: 200,
              gap: 2,
              opacity: 0,
              transition: "opacity 0.2s ease-in-out",
            },
            "&:hover .action-container": {
              opacity: 1,
            },
          },
        }}
      />
      <UpdateVoucherModal
        open={openUpdate}
        handleClose={() => setOpenUpdate(false)}
        voucher={selectedVoucher || {}}
      />
      <VoucherDetailModal
        open={openDetail}
        handleClose={() => setOpenDetail(false)}
        voucher={selectedVoucher || {}}
      />
    </Paper>
  );
}
