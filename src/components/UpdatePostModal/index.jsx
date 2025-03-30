import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/system";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "../../apis/axios";

const PreviewContainer = styled(Box)({
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
  marginTop: "8px",
});

const PreviewImageWrapper = styled(Box)({
  position: "relative",
  width: "80px",
  height: "80px",
  overflow: "hidden",
  borderRadius: "5px",
  "&:hover .delete-button": {
    display: "flex",
  },
});

const PreviewImage = styled("img")({
  width: "100%",
  height: "100%",
  objectFit: "cover",
  borderRadius: "5px",
});

const RemoveButton = styled(IconButton)({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  background: "#FFCDD2",
  color: "#D32F2F",
  padding: "6px",
  borderRadius: "50%",
  display: "none",
  "&:hover": {
    background: "#F8BBD0",
  },
});

export default function UpdatePostModal({ open, handleClose, post, onUpdate }) {
  const [content, setContent] = useState("");
  const [hashtag, setHashtag] = useState("");
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (open && post) {
      setContent(post.content || "");
      setHashtag(post.hashtag || "");
      setImages(post.images || []);
    }
  }, [open, post]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      alert("Bạn chỉ có thể chọn tối đa 5 ảnh!");
      return;
    }

    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newImages]);
  };

  const handleRemoveImage = (index) => {
    const newImages = [...images];
    if (newImages[index].preview) {
      URL.revokeObjectURL(newImages[index].preview);
    }
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      alert("Nội dung không được để trống!");
      return;
    }

    let uploadedImages = [];
    const formData = new FormData();

    images.forEach((image) => {
      if (image.file) {
        formData.append("files", image.file);
      } else {
        uploadedImages.push(image);
      }
    });

    try {
      if (formData.has("files")) {
        const uploadRes = await axios.post(`/upload`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        uploadedImages = [...uploadedImages, ...uploadRes.data.url];
      }

      const updatedPost = {
        ...post,
        content,
        hashtag,
        images: uploadedImages,
      };

      onUpdate(updatedPost);
      handleClose();
    } catch (error) {
      console.error("Lỗi API: ", error);
    }
  };

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
        <Typography variant="h6" gutterBottom>
          Cập nhật bài viết
        </Typography>
        <TextField
          fullWidth
          label="Nội dung"
          multiline
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Hashtag"
          value={hashtag}
          onChange={(e) => setHashtag(e.target.value)}
          margin="normal"
        />

        {/* Xem trước ảnh */}
        <PreviewContainer>
          {images.map((img, index) => (
            <PreviewImageWrapper key={index}>
              <PreviewImage src={img.preview || img} alt="Preview" />
              <RemoveButton
                className="delete-button"
                onClick={() => handleRemoveImage(index)}
                size="small"
              >
                <DeleteIcon fontSize="small" />
              </RemoveButton>
            </PreviewImageWrapper>
          ))}
        </PreviewContainer>

        {/* Upload ảnh */}
        <Box display="flex" alignItems="center" mt={2}>
          <input
            type="file"
            accept="image/*"
            id="upload-image"
            style={{ display: "none" }}
            onChange={handleImageChange}
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

        {/* Nút hành động */}
        <Box display="flex" justifyContent="space-between" mt={2}>
          <Button onClick={handleClose} variant="outlined" color="secondary">
            Hủy
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Cập nhật
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
