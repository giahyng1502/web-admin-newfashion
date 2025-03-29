import { Modal, Box, Typography, Button } from "@mui/material";

export default function PostDetailModal({ open, handleClose, post }) {
  if (!post) return null;

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
        <Typography variant="h6" component="h2">
          Chi tiết bài viết
        </Typography>
        <Typography sx={{ mt: 2 }}>
          <strong>ID:</strong> {post._id}
        </Typography>
        <Typography sx={{ mt: 1 }}>
          <strong>Nhãn:</strong> {post.hashtag}
        </Typography>
        <Typography sx={{ mt: 1 }}>
          <strong>Ngày tạo:</strong> {post.createdAt}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          {post.images?.length > 0 ? (
            <img
              src={post.images[0]}
              alt="Post"
              style={{
                width: 100,
                height: 100,
                objectFit: "cover",
                borderRadius: 5,
              }}
            />
          ) : (
            <Typography>Không có ảnh</Typography>
          )}
        </Box>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3 }}
          onClick={handleClose}
        >
          Đóng
        </Button>
      </Box>
    </Modal>
  );
}
