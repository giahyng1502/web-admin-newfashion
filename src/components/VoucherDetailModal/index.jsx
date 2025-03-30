import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

const VoucherDetailModal = ({ open, handleClose, voucher }) => {
  if (!voucher) return null;

  return (
    <Modal open={open} onClose={handleClose}>
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
          Thông Tin Voucher
        </Typography>
        <Typography>
          <strong>Tên:</strong> {voucher.voucherName}
        </Typography>
        <Typography>
          <strong>Chi tiết:</strong> {voucher.voucherDetail}
        </Typography>
        <Typography>
          <strong>Số lượng:</strong> {voucher.limit}
        </Typography>
        <Typography>
          <strong>Ngày bắt đầu:</strong> {voucher.startDate}
        </Typography>
        <Typography>
          <strong>Ngày kết thúc:</strong> {voucher.endDate}
        </Typography>
        <Typography>
          <strong>Giảm giá:</strong> {voucher.discount}%
        </Typography>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleClose}
        >
          Đóng
        </Button>
      </Box>
    </Modal>
  );
};

export default VoucherDetailModal;
