import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  TextField,
  Paper,
  useTheme,
  Typography,
  IconButton,
  Card,
  Button,
  Divider,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  Autocomplete,
} from "@mui/material";
import { ObjectId } from "bson";
import { tokens } from "../../theme";
import { AddPhotoAlternateOutlined } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Close";
import {
  getAllSubCate,
  getAllSubCateName,
  getSubcate,
} from "../../redux/reducer/subcateReducer";
import { useDispatch, useSelector } from "react-redux";
import DescriptionDialog from "../../dialogs/add-product";
import CustomAutocomplete from "../../components/autoComplateText";
import { uploadImage } from "../../upload/uploadImage";
import axios from "../../apis/axios";
import ValueComfirm from "../../dialogs/value-comfirm";
function AddProduct() {
  const [product, setProduct] = useState({
    name: "",
    stock: "",
    cost: "",
    price: "",
    size: "",
    color: [],
    image: [],
  });
  const [isDescDialog, setIsDescDialog] = useState(false);
  const [newColor, setNewColor] = useState({
    nameColor: "",
    imageColor: "",
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState("");

  const dispatch = useDispatch();
  const { subcate } = useSelector((state) => state.subcate);
  useEffect(() => {
    getSubcate().then((data) => {
      dispatch(getAllSubCate(data));
    });
  }, [dispatch]);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Thêm màu mới vào danh sách
  const handleAddColor = () => {
    if (!newColor.nameColor || !newColor.imageColor) {
      alert("Vui lòng chọn ảnh và nhập tên màu!");
      return;
    }

    setProduct((prev) => ({
      ...prev,
      color: [...prev.color, { ...newColor, _id: new ObjectId().toString() }],
    }));
    setNewColor({ nameColor: "", imageColor: "" }); // Reset input
  };

  // Xóa màu đã thêm
  const handleDeleteColor = (index) => {
    setProduct((prev) => ({
      ...prev,
      color: prev.color.filter((_, i) => i !== index),
    }));
  };
  const validateForm = () => {
    if (!product.name.trim()) {
      setDialogContent("Vui lòng nhập tên sản phẩm!");
      setDialogOpen(true);
      return false;
    }
    if (
      !product.stock.trim() ||
      isNaN(product.stock) ||
      Number(product.stock) <= 0
    ) {
      setDialogContent("Vui lòng nhập số lượng tồn kho hợp lệ!");
      setDialogOpen(true);
      return false;
    }
    if (!product.subCategory) {
      setDialogContent("Vui lòng chọn thể loại sản phẩm hợp lệ!");
      setDialogOpen(true);
      return false;
    }
    if (
      !product.cost.trim() ||
      isNaN(product.cost) ||
      Number(product.cost) <= 0
    ) {
      setDialogContent("Vui lòng nhập giá nhập hợp lệ!");
      setDialogOpen(true);
      return false;
    }
    if (
      !product.price.trim() ||
      isNaN(product.price) ||
      Number(product.price) <= 0
    ) {
      setDialogContent("Vui lòng nhập giá bán hợp lệ!");
      setDialogOpen(true);
      return false;
    }
    if (!product.size.trim()) {
      setDialogContent("Vui lòng nhập kích thước sản phẩm!");
      setDialogOpen(true);
      return false;
    }
    if (!product.subCategory) {
      setDialogContent("Vui lòng chọn danh mục sản phẩm!");
      setDialogOpen(true);
      return false;
    }
    if (product.color.length === 0) {
      setDialogContent("Vui lòng thêm ít nhất một màu cho sản phẩm!");
      setDialogOpen(true);
      return false;
    }
    if (product.image.length === 0) {
      setDialogContent("Vui lòng thêm ít nhất một ảnh sản phẩm!");
      setDialogOpen(true);
      return false;
    }
    if (!product.description) {
      setDialogContent("Vui lòng mô tả sản phẩm");
      setDialogOpen(true);
      return false;
    }
    return true;
  };

  const uploadProduct = async () => {
    if (!validateForm()) return;
    try {
      await axios.post("/addProduct", product);
      setDialogContent("Sản phẩm đã được thêm thành công!");
    } catch (err) {
      setDialogContent("Có lỗi xảy ra, vui lòng thử lại!");
    }
    setDialogOpen(true);
  };

  // Xóa ảnh sản phẩm đã chọn
  const handleDeleteImage = (index) => {
    setProduct((prev) => ({
      ...prev,
      image: prev.image.filter((_, i) => i !== index),
    }));
  };
  // Xử lý khi chọn ảnh màu
  const handleColorImageChange = async (e) => {
    if (e.target.files.length > 0) {
      const images = await uploadImage(Array.from(e.target.files));
      setNewColor((prev) => ({
        ...prev,
        imageColor: images[0],
      }));
    }
  };

  // Xử lý khi chọn nhiều ảnh sản phẩm
  const handleProductImagesChange = async (e) => {
    if (!e.target.files.length) return;

    const images = await uploadImage(Array.from(e.target.files)); // 🟢 Gửi tất cả ảnh lên API
    console.log(images);
    if (images.length > 0) {
      setProduct((prev) => ({
        ...prev,
        image: [...prev.image, ...images], // 🟢 Thêm danh sách ảnh mới vào state
      }));
    }
  };

  return (
    <>
      <ValueComfirm
        open={dialogOpen}
        content={dialogContent}
        onClose={() => setDialogOpen(false)}
      />
      <DescriptionDialog
        open={isDescDialog}
        onSave={(data) => {
          setProduct((prev) => ({
            ...prev,
            description: data,
          }));
          console.log(product);
        }}
        onClose={() => {
          setIsDescDialog(false);
        }}
      />
      <Paper
        sx={{
          width: "95%",
          height: "83vh",
          margin: "0 auto",
          padding: 3,
          backgroundColor: colors.primary[400],
          overflow: "auto",
        }}
      >
        <Grid container spacing={2}>
          {/* Hiển thị danh sách ảnh sản phẩm */}
          {product.image.map((item, index) => (
            <Grid item xs={2} key={index}>
              <Card sx={{ position: "relative" }}>
                <img
                  src={item}
                  alt={`image-${index}`}
                  width="100%"
                  height="100%"
                  style={{ objectFit: "cover" }}
                />
                <IconButton
                  sx={{ position: "absolute", top: 5, right: 5 }}
                  onClick={() => handleDeleteImage(index)}
                >
                  <DeleteIcon color="error" />
                </IconButton>
              </Card>
            </Grid>
          ))}
          <Grid item xs={12}>
            {/* Nút chọn ảnh sản phẩm */}
            <Button variant="contained" component="label">
              Thêm ảnh sản phẩm
              <input
                type="file"
                hidden
                accept="image/*"
                multiple
                onChange={handleProductImagesChange}
              />
            </Button>
          </Grid>
          {/* Thông tin sản phẩm */}

          <Grid item xs={8}>
            <TextField
              label="Tên sản phẩm"
              variant="outlined"
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
              size="medium"
              fullWidth
              color="secondary"
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Tồn kho"
              variant="outlined"
              type={"number"}
              value={product.stock}
              onChange={(e) =>
                setProduct({ ...product, stock: e.target.value })
              }
              size="medium"
              fullWidth
              color="secondary"
              sx={{ marginBottom: 2 }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Giá nhập"
              type={"number"}
              variant="outlined"
              value={product.cost}
              onChange={(e) => setProduct({ ...product, cost: e.target.value })}
              size="medium"
              fullWidth
              color="secondary"
              sx={{ marginBottom: 2 }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Giá bán ra"
              type={"number"}
              variant="outlined"
              value={product.price}
              onChange={(e) =>
                setProduct({ ...product, price: e.target.value })
              }
              size="medium"
              fullWidth
              color="secondary"
              sx={{ marginBottom: 2 }}
            />
          </Grid>
          <Grid item xs={6}>
            <CustomAutocomplete
              subcate={subcate}
              onSelect={(selectedSubCate) => {
                setProduct((prev) => ({
                  ...prev,
                  subCategory: selectedSubCate._id, // Lưu ID của danh mục đã chọn
                }));
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Size cách nhau bởi dấu ,"
              variant="outlined"
              value={product.size}
              onChange={(e) => setProduct({ ...product, size: e.target.value })}
              size="medium"
              fullWidth
              multiline
              color="secondary"
              sx={{ marginBottom: 2 }}
            />
          </Grid>
          <Grid item xs={2}>
            <Button
              onClick={() => {
                setIsDescDialog(true);
              }}
              variant="contained"
            >
              Description
            </Button>
          </Grid>

          {/* Danh sách màu đã thêm */}
          {product.color.map((item, index) => (
            <Grid item key={index} xs={2}>
              <Card
                elevation={8}
                sx={{ position: "relative", padding: 2, textAlign: "center" }}
              >
                <img
                  src={item.imageColor}
                  alt="image-color"
                  width={50}
                  height={50}
                  style={{ borderRadius: 5 }}
                />
                <Typography>{item.nameColor}</Typography>
                <IconButton
                  sx={{ position: "absolute", top: 5, right: 5 }}
                  onClick={() => handleDeleteColor(index)}
                >
                  <DeleteIcon color="error" />
                </IconButton>
              </Card>
            </Grid>
          ))}

          {/* Thêm màu mới */}
          <Grid item xs={2}>
            <Card
              elevation={8}
              sx={{
                backgroundColor: colors.primary[400],
                borderRadius: 2,
                p: 2,
                textAlign: "center",
                position: "relative",
              }}
            >
              {newColor.imageColor ? (
                <Box sx={{ position: "relative" }}>
                  <img
                    src={newColor.imageColor}
                    alt="selected-color"
                    width={80}
                    height={80}
                    style={{ borderRadius: 5 }}
                  />
                  <IconButton
                    sx={{ position: "absolute", top: 5, right: 5 }}
                    onClick={() =>
                      setNewColor((prev) => ({ ...prev, imageColor: "" }))
                    }
                  >
                    <DeleteIcon color="error" />
                  </IconButton>
                </Box>
              ) : (
                <IconButton component="label" sx={{ width: 90, height: 90 }}>
                  <AddPhotoAlternateOutlined sx={{ height: 60, width: 60 }} />
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleColorImageChange}
                  />
                </IconButton>
              )}

              <TextField
                label="Tên màu"
                variant="outlined"
                color="secondary"
                value={newColor.nameColor}
                onChange={(e) =>
                  setNewColor({ ...newColor, nameColor: e.target.value })
                }
                fullWidth
                sx={{ mt: 1 }}
              />

              <Button
                variant="contained"
                color="secondary"
                sx={{ mt: 1, width: "100%" }}
                onClick={handleAddColor}
              >
                OK
              </Button>
            </Card>
          </Grid>
          <Grid xs={12} />
        </Grid>
        <Divider sx={{ my: 2 }} />
        <Button
          onClick={uploadProduct}
          variant={"contained"}
          sx={{ float: "right" }}
          color={"primary"}
        >
          Lưu
        </Button>
      </Paper>
    </>
  );
}

export default AddProduct;
