import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  Backdrop,
  Fade,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { updateVoucher } from "../../redux/voucher/voucherSlice";

const UpdateVoucherModal = ({ open, handleClose, voucher }) => {
  const [voucherData, setVoucherData] = useState({
    _id: "",
    voucherName: "",
    voucherDetail: "",
    limit: 0,
    startDate: "",
    maxDiscountPrice : 0,
    endDate: "",
    discount: 0,
  });

  const dispatch = useDispatch();

  useEffect(() => {
    if (open && voucher) {
      setVoucherData({
        ...voucher,
        voucherName: voucher.voucherName ?? "",
        voucherDetail: voucher.voucherDetail ?? "",
        limit: voucher.limit ?? 0,
        startDate: voucher.startDate
          ? new Date(voucher.startDate).toISOString().split("T")[0]
          : "",
        endDate: voucher.endDate
          ? new Date(voucher.endDate).toISOString().split("T")[0]
          : "",
        discount: voucher.discount ?? 0,
      });
    }
  }, [open, voucher]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVoucherData((prevState) => ({
      ...prevState,
      [name]: value ?? "",
    }));
  };

  const handleSubmit = async () => {
    try {
      if (!voucherData._id) {
        alert("Lỗi: Không tìm thấy ID của voucher!");
        return;
      }

      await dispatch(
        updateVoucher({ voucherId: voucherData._id, data: voucherData })
      ).then((result) => {
        if (result.meta.requestStatus === "fulfilled") {
          alert("Voucher đã được cập nhật thành công!");
          handleClose();
        } else {
          alert("Cập nhật voucher thất bại!");
        }
      });
    } catch (error) {
      console.error("Lỗi khi cập nhật voucher:", error);
      alert("Lỗi khi cập nhật voucher!");
    }
  };

  if (!open) return null;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h3" sx={{ mb: 2 }}>
            Thêm Voucher
          </Typography>

          <TextField
            label="Tên Voucher"
            name="voucherName"
            fullWidth
            margin="normal"
            value={voucherData.voucherName}
            onChange={handleChange}
          />
          <TextField
            label="Chi tiết"
            name="voucherDetail"
            fullWidth
            margin="normal"
            value={voucherData.voucherDetail}
            onChange={handleChange}
          />
          <TextField
            label="Giới hạn"
            name="limit"
            type="number"
            fullWidth
            margin="normal"
            value={voucherData.limit}
            onChange={handleChange}
          />
          <TextField
            label="Ngày bắt đầu"
            name="startDate"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={voucherData.startDate}
            onChange={handleChange}
          />
          <TextField
            label="Ngày kết thúc"
            name="endDate"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={voucherData.endDate}
            onChange={handleChange}
          />
          <TextField
            label="Giảm giá (%)"
            name="discount"
            type="number"
            fullWidth
            margin="normal"
            value={voucherData.discount}
            onChange={handleChange}
          />
          <TextField
            label="Giảm giá (%)"
            name="maxDiscountPrice"
            type="number"
            fullWidth
            margin="normal"
            value={voucherData.maxDiscountPrice}
            onChange={handleChange}
          />

          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleSubmit}
          >
            Thêm Voucher
          </Button>
        </Box>
      </Fade>
    </Modal>
  );
};

export default UpdateVoucherModal;
