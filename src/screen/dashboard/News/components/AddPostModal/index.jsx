import React, { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { createPost } from "../../../../../redux/post/postActions";
import { CancelOutlined } from "@mui/icons-material";
import { useNotify } from "../../../../../hooks/useNotify";
import { Node } from "slate";
import { EMPTY_PARAGRAPH } from "../SlateEditor/useSlateEditor";
import Collections from "@mui/icons-material/CollectionsOutlined";
import axios from "../../../../../apis/axios";
import SlateEditor from "../SlateEditor";

const AddPostModal = ({ open, handleClose, onSuccess }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.post);
  const [content, setContent] = useState(EMPTY_PARAGRAPH);
  const [hashtags, setHashtags] = useState([]);
  const [images, setImages] = useState([]);
  const { createSuccess } = useNotify();

  useEffect(() => {
    if (open) {
      setContent(EMPTY_PARAGRAPH);
      setImages([]);
    }
  }, [open]);

  useEffect(() => {
    if (!open && images.length > 0) {
      images.forEach((img) => {
        if (img.preview) {
          URL.revokeObjectURL(img.preview);
        }
      });
      setImages([]);
    }
  }, [open]);

  const avatarUrl = localStorage.getItem("avatar");
  const name = localStorage.getItem("name");

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
    const plainTextContent = content
      .map((node) => Node.string(node)) // Node.string là function trong Slate
      .join("\n")
      .trim();

    if (!plainTextContent) {
      alert("Vui lòng nhập nội dung bài viết!");
      return;
    }

    if (!images || images.length === 0) {
      alert("Vui lòng chọn ít nhất 1 ảnh!");
      return;
    }
    const postData = {
      content: JSON.stringify(content),
      hashtag: hashtags?.join(" ") || " ",
      images: images.map((img) => img.url),
    };

    try {
      await dispatch(createPost(postData)).then((result) => {
        if (result.meta.requestStatus === "fulfilled") {
          createSuccess("Bài viết");
          setContent([EMPTY_PARAGRAPH]);
          setHashtags([]);
          setImages([]);
          onSuccess();
        } else {
          alert("Tạo bài viết thất bại!");
        }
      });
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra khi thêm bài viết!");
    }
  };

  const isSubmitDisabled = useMemo(() => {
    if (!Array.isArray(content)) return true;

    const plainTextContent = content
      .map((n) => Node.string(n))
      .join("\n")
      .trim();

    return plainTextContent.length === 0 && images.length === 0;
  }, [content, images]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          width: "700px",
          maxWidth: "none",
        },
      }}
    >
      <Box>
        <DialogTitle
          sx={{
            fontSize: 20,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Tạo bài viết
        </DialogTitle>
        <IconButton
          sx={{
            position: "absolute",
            right: 10,
            top: 12,
          }}
          onClick={handleClose}
        >
          <CancelOutlined fontSize="large" />
        </IconButton>
      </Box>
      <hr color="#797979" style={{ width: "100%" }} />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          marginLeft: 3,
        }}
      >
        <img
          style={{ width: 40, height: 40, borderRadius: 50 }}
          src={avatarUrl}
          alt="avatar"
        />
        <p style={{ fontWeight: "bold" }}>{name}</p>
      </Box>
      <DialogContent sx={{ maxHeight: "50vh", overflowY: "auto" }}>
        <SlateEditor
          content={Array.isArray(content) ? content : EMPTY_PARAGRAPH}
          setContent={(value) => {
            console.log("Content value in SlateEditor:", value);
            setContent(value);
          }}
          setHashtags={setHashtags}
        />
        <Box border={1} borderRadius={2} mt={2} sx={{ borderColor: "#8f8f8f" }}>
          <Box display="flex" alignItems="center" mt={1} mb={1} ml={0.5}>
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
                <Collections />
              </IconButton>
            </label>
            <Typography variant="body3">
              {images.length > 0
                ? `Đã chọn ${images.length} ảnh`
                : "Thêm ảnh vào bài viết của bạn"}
            </Typography>
          </Box>
        </Box>
        {/* Khung preview ảnh */}
        {images.length > 0 && (
          <Box
            sx={{
              border: "1px solid #ccc",
              borderRadius: 2,
              p: 1,
              mt: 2,
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <Box sx={{ display: "flex", gap: 1 }}>
              {images.slice(0, 2).map((image, index) => (
                <Box
                  key={index}
                  sx={{
                    flex: 1,
                    aspectRatio: "1/1",
                    overflow: "hidden",
                    position: "relative",
                    borderRadius: 2,
                  }}
                >
                  <img
                    src={image.preview}
                    alt={`preview-${index}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveImage(index)}
                    sx={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      backgroundColor: "rgba(0,0,0,0.6)",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "rgba(0,0,0,0.8)",
                      },
                    }}
                  >
                    <CancelOutlined fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>

            <Box sx={{ display: "flex", gap: 1 }}>
              {images.slice(2, 5).map((image, index) => (
                <Box
                  key={index + 2}
                  sx={{
                    flex: 1,
                    aspectRatio: "1/1",
                    overflow: "hidden",
                    position: "relative",
                    borderRadius: 2,
                  }}
                >
                  <img
                    src={image.preview}
                    alt={`preview-${index + 2}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveImage(index + 2)}
                    sx={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      backgroundColor: "rgba(0,0,0,0.6)",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "rgba(0,0,0,0.8)",
                      },
                    }}
                  >
                    <CancelOutlined fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", m: 2 }}>
        <span style={{ width: "100%" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading || isSubmitDisabled}
            sx={{
              textTransform: "none",
              fontSize: 16,
              fontWeight: "bold",
              backgroundColor: "#0866ff",
              borderRadius: 2,
            }}
            fullWidth
          >
            {loading ? "Đang lưu..." : "Tạo"}
          </Button>
        </span>
      </DialogActions>
    </Dialog>
  );
};

export default AddPostModal;
