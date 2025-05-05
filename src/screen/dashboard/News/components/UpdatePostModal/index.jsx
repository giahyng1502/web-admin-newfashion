import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Button,
  Typography,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import { CancelOutlined } from "@mui/icons-material";
import { uploadImage } from "../../../../../upload/uploadImage";
import { useNotify } from "../../../../../hooks/useNotify";
import { EMPTY_PARAGRAPH } from "../SlateEditor/useSlateEditor";
import { useSelector } from "react-redux";
import { Node } from "slate";
import { convertContent } from "../../../../../utils/formattingUtils";
import Collections from "@mui/icons-material/CollectionsOutlined";
import SlateEditor from "../SlateEditor";

export default function UpdatePostModal({ open, handleClose, post, onUpdate }) {
  const [content, setContent] = useState(EMPTY_PARAGRAPH);
  const [hashtag, setHashtags] = useState([]);
  const [images, setImages] = useState([]);
  const { loading } = useSelector((state) => state.post);
  const { updateSuccess } = useNotify();

  useEffect(() => {
    if (!open || !post?._id) return;

    const initialSlateValue = convertContent(post.content);
    setContent(initialSlateValue);
    setHashtags(Array.isArray(post.hashtag) ? post.hashtag : []);

    const convertedImage = (post.images || []).map((img) =>
      typeof img === "string" ? { preview: img } : img
    );
    setImages(convertedImage);
  }, [open, post?._id]);

  const avatarUrl = localStorage.getItem("avatar");
  const name = localStorage.getItem("name");

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
    if (newImages[index]?.preview) {
      URL.revokeObjectURL(newImages[index]?.preview);
    }
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleSubmit = async () => {
    const plainText = content
      .map((n) => Node.string(n))
      .join("\n")
      .trim();
    if (!plainText && images.length === 0) {
      alert("Nội dung không được để trống!");
      return;
    }

    const hashtagString = Array.isArray(hashtag)
      ? hashtag.join(" ")
      : hashtag || "";

    const existingUrls = [];
    const formData = new FormData();

    images.forEach((image) => {
      if (image.file) {
        formData.append("files", image.file);
      } else {
        const url = image.url || image.preview;
        if (url) existingUrls.push(url);
      }
    });

    try {
      let newUrls = [];
      if (formData.has("files")) {
        newUrls = await uploadImage(formData);
      }
      const allImageUrls = [...existingUrls, ...newUrls];

      const updatedPost = {
        ...post,
        content: JSON.stringify(content),
        hashtag: hashtagString,
        images: allImageUrls,
      };

      onUpdate(updatedPost);
      updateSuccess("bài viết");
      handleClose();
    } catch (error) {
      if (error.response) {
        console.error("API lỗi:", error.response.status, error.response.data);
      } else {
        console.error("Lỗi mạng:", error);
      }
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
          Chỉnh sửa bài viết
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
          setContent={setContent}
          setHashtags={setHashtags}
        />
        <Box border={1} borderRadius={2} mt={2} sx={{ borderColor: "#8f8f8f" }}>
          <Box display="flex" alignItems="center" mt={1} mb={1} ml={0.5}>
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
                    src={image.preview || image.url || ""}
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
                    src={image.preview || image.url || ""}
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
            {loading ? "Đang lưu..." : "Lưu"}
          </Button>
        </span>
      </DialogActions>
    </Dialog>
  );
}
