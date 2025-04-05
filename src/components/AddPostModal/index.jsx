import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { createPost } from "../../redux/post/postActions";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import axios from "../../apis/axios";
import { useNotify } from "../../hooks/useNotify";

const AddPostModal = ({ open, handleClose, onSuccess }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.post);
  const [content, setContent] = useState("");
  const [hashtag, setHashtag] = useState("");
  const [images, setImages] = useState([]);
  const { createSuccess } = useNotify();

  const handleFileChange = async (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (selectedFiles.length + images.length > 5) {
      alert("Bạn chỉ có thể chọn tối đa 5 ảnh!");
      return;
    }

    const imagePreviews = selectedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages([...images, ...imagePreviews]);

    const formFilesData = new FormData();
    selectedFiles.forEach((file) => formFilesData.append("files", file));

    try {
      const uploadRes = await axios.post(`/upload`, formFilesData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const uploadedUrls = uploadRes.data.url || [];
      setImages((prev) =>
        prev.map((img, index) => ({
          ...img,
          url: uploadedUrls[index],
        }))
      );
    } catch (error) {
      alert("Lỗi upload ảnh!");
    }
  };

  const handleRemoveImage = (index) => {
    const newImages = [...images];
    URL.revokeObjectURL(newImages[index].preview);
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleSubmit = async () => {
    if (!content.trim() || !images)
      return alert("Vui lòng nhập nội dung và tải ảnh!");

    const postData = {
      content,
      hashtag,
      images: images.map((img) => img.url),
    };

    try {
      await dispatch(createPost(postData)).then((result) => {
        if (result.meta.requestStatus === "fulfilled") {
          createSuccess("Bài viết");
          setContent("");
          setHashtag("");
          setImages([]);
          onSuccess();
        } else {
          alert("Tạo bài viết thất bại!");
        }
      });
    } catch (error) {
      alert("Có lỗi xảy ra khi thêm bài viết!");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Tạo Bài Viết</DialogTitle>
      <DialogContent>
        <Box display="flex" alignItems="center" mt={2}>
          <input
            type="file"
            accept="image/*"
            id="upload-image"
            style={{ display: "none" }}
            onChange={handleFileChange}
            multiple
          />
          <label htmlFor="upload-image">
            <IconButton color="secondary" component="span">
              <PhotoCamera />
            </IconButton>
          </label>
          <Typography variant="body2">
            {images.length > 0
              ? `Đã chọn ${images.length} ảnh`
              : "Chọn ảnh mới"}
          </Typography>
        </Box>
        {/* Hiển thị ảnh đã chọn */}
        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          {images.map((image, index) => (
            <div key={index} style={{ position: "relative" }}>
              <img
                src={image.preview}
                alt={`preview-${index}`}
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  borderRadius: "5px",
                }}
              />
              <button
                onClick={() => handleRemoveImage(index)}
                style={{
                  position: "absolute",
                  top: "-5px",
                  right: "-5px",
                  border: "none",
                  borderRadius: "50%",
                  padding: 4,
                  cursor: "pointer",
                }}
              >
                ❌
              </button>
            </div>
          ))}
        </div>
        <TextField
          fullWidth
          multiline
          label="Nội dung"
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          sx={{ mt: 2 }}
        />
        <TextField
          fullWidth
          label="Hashtag"
          value={hashtag}
          onChange={(e) => setHashtag(e.target.value)}
          sx={{ mt: 2 }}
        />
      </DialogContent>
      <DialogActions sx={{ mr: 2, mb: 2 }}>
        <Button onClick={handleClose} color="error">
          Hủy
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Đang lưu..." : "Lưu bài viết"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddPostModal;
