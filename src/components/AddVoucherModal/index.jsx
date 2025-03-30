import React, { useState } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  Backdrop,
  Fade,
} from "@mui/material";
import { createVoucher } from "../../redux/voucher/voucherSlice";
import { useDispatch } from "react-redux";

const AddVoucherModal = ({ open, handleClose }) => {
  const [voucherData, setVoucherData] = useState({
    voucherName: "",
    voucherDetail: "",
    limit: 0,
    startDate: "",
    endDate: "",
    discount: 0,
  });
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setVoucherData({ ...voucherData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await dispatch(createVoucher(voucherData)).then((result) => {
        if (result.meta.requestStatus === "fulfilled") {
          alert("Voucher đã được tạo thành công!");
          setVoucherData({
            voucherName: "",
            voucherDetail: "",
            limit: 0,
            startDate: "",
            endDate: "",
            discount: 0,
          });
          handleClose();
        } else {
          alert("Tạo voucher thất bại!");
        }
      });
    } catch (error) {
      console.error("Lỗi khi thêm voucher:", error);
      alert("Lỗi khi thêm voucher!");
    }
  };

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

export default AddVoucherModal;
