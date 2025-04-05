import React, { useState, useEffect } from "react";
import { ObjectId } from "bson";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import { Close, Add, Delete } from "@mui/icons-material";
import axios from "../apis/axios";
import ComfirmDelete from "./comfirm-delete";
import { updateProduct } from "../redux/reducer/productReducer";

const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("files", file);

  try {
    const response = await axios.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log(response.data); // Kiểm tra response
    return response.data.url; // Trả về URL ảnh
  } catch (error) {
    console.error("Lỗi upload ảnh:", error);
    return null;
  }
};

const ProductDialog = ({
  open,
  onClose,
  product,
  colors,
  dispatch,
  showNotification,
}) => {
  const [images, setImages] = useState([]);
  const [colorImages, setColorImages] = useState([]);
  const [newColor, setNewColor] = useState({ nameColor: "", imageColor: null });
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null); // Lưu vị trí ảnh cần xóa
  useEffect(() => {
    setImages(product?.image || []);
    setColorImages(product?.color?.map((c) => ({ ...c })) || []);
  }, [product]);

  const updateProduct2 = async () => {
    try {
      const res = await axios.put(`/updateProduct/${product._id}`, {
        image: images,
        color: colorImages,
      });
      if (res.status === 200) {
        const data = res.data.product;
        const valueDate = {
          id: data._id,
          name: data.name,
          cost: data.cost,
          price: data.price,
          stock: data.stock,
          sold: data.sold,
          rateCount: data.rateCount,
        };
        dispatch(updateProduct(valueDate));
        showNotification("Cập nhật sản phẩm thành công", "success");
      }
    } catch (e) {}
  };
  // Chọn ảnh và upload ảnh sản phẩm
  const handleFileChangeForProduct = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = await uploadImage(file);
      if (imageUrl.length > 0) {
        setImages((prev) => [...prev, imageUrl[0]]);
      }
    }
  };

  // Chọn ảnh và upload ảnh màu sắc
  const handleFileChangeForColor = async (event, index) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = await uploadImage(file);
      if (imageUrl.length > 0) {
        setColorImages((prev) =>
          prev.map((c, i) =>
            i === index ? { ...c, imageColor: imageUrl[0] } : c
          )
        );
      }
    }
  };

  // Chọn ảnh và upload cho màu sắc mới
  const handleFileChangeForNewColor = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = await uploadImage(file);
      if (imageUrl.length > 0) {
        setNewColor((prev) => ({ ...prev, imageColor: imageUrl[0] }));
      }
    }
  };

  // Sửa tên màu
  const handleEditColorName = (index, name) => {
    setColorImages((prev) =>
      prev.map((c, i) => (i === index ? { ...c, nameColor: name } : c))
    );
  };

  // Thêm màu sắc mới
  const handleAddColor = () => {
    if (newColor.nameColor && newColor.imageColor) {
      setColorImages((prev) => [
        ...prev,
        { ...newColor, _id: new ObjectId().toString() },
      ]);
      setNewColor({ nameColor: "", imageColor: null });
    }
  };
  const handleConfirmDelete = (index, type) => {
    setDeleteTarget({ index, type });
    setIsOpenDelete(true);
  };
  const handleDeleteConfirmed = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === "product") {
      setImages((prev) => prev.filter((_, i) => i !== deleteTarget.index));
    } else if (deleteTarget.type === "color") {
      setColorImages((prev) => prev.filter((_, i) => i !== deleteTarget.index));
    }
    setIsOpenDelete(false);
    setDeleteTarget(null);
  };

  if (!product) return null;

  return (
    <>
      <ComfirmDelete
        colors={colors}
        open={isOpenDelete}
        onClose={() => setIsOpenDelete(false)}
        title={"Bạn có chắc chắn muốn xóa không"}
        onDelete={handleDeleteConfirmed}
      />
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <div style={{ backgroundColor: colors.primary[400] }}>
          <DialogTitle>
            <Typography variant={"h4"}>Thông tin sản phẩm</Typography>
            <IconButton
              aria-label="close"
              onClick={onClose}
              sx={{ position: "absolute", right: 8, top: 8 }}
            >
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <Typography variant="h5">{product._id}</Typography>
            <Typography variant="h5">{product.name}</Typography>
            <Typography>Giá: {product.price?.toLocaleString()} VND</Typography>
            <Typography>Kho: {product.stock || 0} sản phẩm</Typography>

            {/* Màu sắc */}
            <Typography variant="subtitle1" mt={2}>
              Màu sắc:
            </Typography>
            <Box display="flex" gap={2} flexWrap="wrap">
              {colorImages.map((c, index) => (
                <Box key={c._id} position="relative" textAlign="center">
                  <label>
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(e) => handleFileChangeForColor(e, index)}
                    />
                    <Box>
                      <img
                        src={c.imageColor}
                        alt={c.nameColor}
                        width={50}
                        height={50}
                        style={{ borderRadius: 5, cursor: "pointer" }}
                        title="Nhấn để thay đổi ảnh"
                      />
                    </Box>
                  </label>
                  <IconButton
                    size="small"
                    sx={{
                      position: "absolute",
                      top: -5,
                      right: -5,
                      backgroundColor: colors.primary[400],
                    }}
                    onClick={() => handleConfirmDelete(index, "color")}
                  >
                    <Close fontSize="small" />
                  </IconButton>
                  <TextField
                    variant="standard"
                    size="small"
                    value={c.nameColor}
                    onChange={(e) => handleEditColorName(index, e.target.value)}
                    sx={{ mt: 1 }}
                  />
                </Box>
              ))}
            </Box>

            {/* Thêm màu mới */}
            <Typography variant="subtitle1" mt={2}>
              Thêm màu sắc:
            </Typography>
            <Box display="flex" gap={2} alignItems="center">
              <TextField
                label="Tên màu"
                variant="outlined"
                size="small"
                value={newColor.nameColor}
                onChange={(e) =>
                  setNewColor((prev) => ({
                    ...prev,
                    nameColor: e.target.value,
                  }))
                }
              />
              <Button variant="contained" component="label">
                Chọn ảnh
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFileChangeForNewColor}
                />
              </Button>
              {newColor.imageColor && (
                <img
                  src={newColor.imageColor}
                  alt="new-color"
                  width={50}
                  height={50}
                  style={{ borderRadius: 5 }}
                />
              )}
              <IconButton color="secondary" onClick={handleAddColor}>
                <Add />
              </IconButton>
            </Box>

            {/* Ảnh sản phẩm */}
            <Typography variant="subtitle1" mt={2}>
              Ảnh sản phẩm:
            </Typography>
            <Box display="flex" gap={2} flexWrap="wrap">
              {images.length > 0 ? (
                images.map((img, index) => (
                  <Box key={index} position="relative">
                    <img
                      src={img}
                      alt={`product-${index}`}
                      width={100}
                      height={100}
                      style={{ borderRadius: 5 }}
                    />
                    <IconButton
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        backgroundColor: colors.primary[400],
                      }}
                      onClick={() => handleConfirmDelete(index, "product")}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  </Box>
                ))
              ) : (
                <Typography>Chưa có ảnh sản phẩm</Typography>
              )}
            </Box>

            {/* Thêm ảnh sản phẩm */}
            <Box display="flex" mt={2} alignItems="center">
              <Button variant="contained" component="label">
                Chọn ảnh sản phẩm
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFileChangeForProduct}
                />
              </Button>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} color="primary" variant="contained">
              Đóng
            </Button>
            <Button
              onClick={updateProduct2}
              color="primary"
              variant="contained"
            >
              Cập nhập
            </Button>
          </DialogActions>
        </div>
      </Dialog>
    </>
  );
};

export default ProductDialog;
