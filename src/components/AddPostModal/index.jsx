import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { createPost } from "../../redux/post/postActions";

const AddPostModal = ({ open, handleClose }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.post);
  const [content, setContent] = useState("");
  const [hashtag, setHashtag] = useState("");
  const [images, setImages] = useState([]);

  const handleFileChange = (e) => {
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
      images: images.map((img) => ({ file: img.file })),
    };

    try {
      await dispatch(createPost(postData)).then((result) => {
        if (result.meta.requestStatus === "fulfilled") {
          alert("Bài viết đã được tạo thành công!");
          setContent("");
          setHashtag("");
          setImages([]);
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
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
        />
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
      <DialogActions>
        <Button onClick={handleClose} color="error">
          Hủy
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? "Đang lưu..." : "Lưu bài viết"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddPostModal;
