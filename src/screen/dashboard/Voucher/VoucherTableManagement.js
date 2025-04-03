import { Box, Button, Paper, useTheme } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import { exportToExcel } from "../../../utils/export-excel";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useSwipeable } from "react-swipeable";
import { throttle } from "lodash";
import { removeVoucher } from "../../../redux/voucher/voucherSlice";
import AddVoucherModal from "../../../components/AddVoucherModal";
import UpdateVoucherModal from "../../../components/UpdateVoucherModal";
import VoucherDetailModal from "../../../components/VoucherDetailModal";
import "./styles.scss";

export default function VoucherTableManagement({
  isLoading,
  rows,
  pageSize,
  setPageSize,
  page,
  setPage,
  rowCount,
}) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [open, setOpen] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [swipedRow, setSwipedRow] = useState(null);
  const [isSwipingBack, setIsSwipingBack] = useState(false);
  const [isSwiping, setIsSwiping] = useState(false);
  const dispatch = useDispatch();

  const swipeTimeoutRef = useRef([]);

  const handleDeleteVoucher = (voucherId) => {
    if (window.confirm("Bạn có chắc muốn xóa voucher này không?")) {
      dispatch(removeVoucher(voucherId));
    }
  };

  const handleUpdateVoucher = (voucherId) => {
    const voucherIdHasFound = rows.find((v) => v._id === voucherId);
    if (voucherIdHasFound) {
      setSelectedVoucher(voucherIdHasFound);
      setOpenUpdate(true);
    }
  };

  const handleRowClick = (event, row) => {
    if (window.getSelection().toString().trim()) return;
    if (event.target.closest(".action-button")) return;
    if (swipedRow) return onSwipedRight();
    if (!isSwiping) {
      setSelectedVoucher(row);
      setOpenDetail(true);
    }
  };

  const handleMouseDown = (event) => {
    const row = event.target.closest(".MuiDataGrid-row");
    if (row && row.dataset.id === swipedRow) {
      event.preventDefault();
    }
  };

  const onSwipedRight = () => {
    if (swipedRow) {
      setIsSwipingBack(true);
      setIsSwiping(true);

      // Xoá tất cả timeout trước đó
      swipeTimeoutRef.current.forEach(clearTimeout);
      swipeTimeoutRef.current.length = 0;

      // Tạo hiệu ứng trượt từ từ bằng cách giữ swipedRow một lúc trước khi xóa
      swipeTimeoutRef.current.push(
        setTimeout(() => {
          setIsSwiping(false);
        }, 150) // Giữ animation một chút trước khi biến mất
      );

      swipeTimeoutRef.current.push(
        setTimeout(() => {
          setSwipedRow(null);
          setIsSwipingBack(false);
        }, 250) // Delay việc ẩn row sau khi animation kết thúc
      );
    }
  };

  useEffect(() => {
    if (swipedRow) {
      document.addEventListener("mousedown", handleMouseDown);
    } else {
      document.removeEventListener("mousedown", handleMouseDown);
    }

    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [swipedRow]);

  const handlers = useSwipeable({
    onSwipedLeft: throttle((eventData) => {
      const rowId =
        eventData.event.target.closest(".MuiDataGrid-row")?.dataset.id;

      // Nếu nhấn vào button action hoặc đang bôi đen text thì không vuốt
      if (!rowId || eventData.event.target.closest(".action-button")) return;

      // Reset selection trước khi vuốt để tránh lỗi "not-allowed"
      if (window.getSelection().toString().trim()) {
        window.getSelection().removeAllRanges();
        return;
      }

      if (rowId && swipedRow !== rowId) {
        setIsSwiping(true);

        // Xoá tất cả timeout trước đó
        swipeTimeoutRef.current.forEach(clearTimeout);
        swipeTimeoutRef.current.length = 0;

        swipeTimeoutRef.current.push(
          setTimeout(() => {
            setSwipedRow(rowId);
          }, 10)
        );

        swipeTimeoutRef.current.push(
          setTimeout(() => {
            setIsSwiping(false);
          }, 300)
        );
      }
    }, 200),
    trackMouse: true,
  });

  useEffect(() => {
    const handleMouseDown = (event) => {
      if (swipedRow) {
        event.preventDefault(); // Chặn click khi đang mở actions
      }
    };

    document.addEventListener("mousedown", handleMouseDown);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [swipedRow]);

  // Cleanup khi unmount
  useEffect(() => {
    return () => {
      swipeTimeoutRef.current.forEach(clearTimeout);
    };
  }, []);

  const columns = [
    { field: "_id", headerName: "ID", width: 180 },
    { field: "voucherName", headerName: "Tên mã", width: 120 },
    { field: "voucherDetail", headerName: "Thông tin chi tiết", width: 250 },
    { field: "limit", headerName: "Số Lượng", width: 90 },
    { field: "discount", headerName: "Giảm Giá (%)", width: 115 },
    { field: "maxDiscountPrice", headerName: "Giảm giá tối đa", width: 100 },
    { field: "startDate", headerName: "Ngày bắt đầu", width: 170 },
    { field: "endDate", headerName: "Ngày kết thúc", width: 170 },
    {
      field: " ",
      renderCell: ({ id }) => {
        return (
          id === swipedRow && (
            <Box
              className="swipe-actions"
              sx={{
                position: "absolute",
                right: -100,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Button
                variant="contained"
                color="error"
                className="action-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteVoucher(id);
                }}
                sx={{
                  minWidth: "50px",
                  padding: "5px",
                  minHeight: "98px",
                  borderRadius: 0,
                  border: "none",
                }}
              >
                <DeleteIcon />
              </Button>
              <Button
                variant="contained"
                color="warning"
                className="action-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleUpdateVoucher(id);
                }}
                sx={{
                  minWidth: "50px",
                  padding: "5px",
                  minHeight: "98px",
                  borderRadius: 0,
                  border: "none",
                }}
              >
                <EditIcon />
              </Button>
            </Box>
          )
        );
      },
    },
  ];

  return (
    <Paper
      sx={{
        height: "80vh",
        width: "100%",
        maxWidth: "1600px",
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
        <AddVoucherModal open={open} handleClose={() => setOpen(false)} />
        <Button
          variant="contained"
          color="primary"
          onClick={() => exportToExcel(rows)}
          sx={{ marginBottom: 2 }}
        >
          Xuất Excel
        </Button>
      </Box>
      <div
        onMouseDown={handleMouseDown}
        className="MuiDataGrid-row"
        style={{ position: "relative", overflow: "hidden" }}
        {...handlers}
      >
        <DataGrid
          rows={rows}
          hideFooterSelectedRowCount={true}
          loading={isLoading}
          columnVisibilityModel={{
            _id: false, // Ẩn cột "id"
          }}
          rowHeight={100}
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
          onRowClick={(params, event) => handleRowClick(event, params.row)}
          getRowClassName={(params) => {
            if (params.id === swipedRow) {
              return isSwipingBack ? "swiping-back" : "swiped";
            }
            return "";
          }}
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
              position: "relative !important",
              overflow: "visible",
              transition: "transform 0.3s ease-in-out",
              pointerEvents: "auto",
              cursor: "pointer",
            },
          }}
        />
      </div>
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
