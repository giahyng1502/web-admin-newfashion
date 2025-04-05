import { Box, Typography, Button, Dialog, DialogContent } from "@mui/material";

export default function PostDetailModal({ open, handleClose, post }) {
  if (!post) return null;

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogContent>
        <Typography variant="h3" component="h2">
          Bài viết chi tiết
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
        <Typography sx={{ mt: 1 }}>
          <strong>Người tạo:</strong> {post.user}
        </Typography>
        <Box sx={{ display: "flex", mt: 2 }}>
          {post.images?.length > 0 ? (
            post.images.map((p, index) => (
              <img
                key={index}
                src={p}
                alt="Post"
                style={{
                  width: 100,
                  height: 100,
                  objectFit: "cover",
                  borderRadius: 5,
                  marginRight: 8,
                }}
              />
            ))
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
      </DialogContent>
    </Dialog>
  );
}
