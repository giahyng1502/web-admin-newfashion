import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { CancelOutlined } from "@mui/icons-material";
import SlateViewer from "../SlateEditor/SlateViewer";
import { convertContent } from "../../../../../utils/formattingUtils";
import ImagesStyleGrid from "../ImagesStyleGrid";

export default function PostDetailModal({ open, handleClose, post }) {
  if (!post) return null;

  const avatarUrl = localStorage.getItem("avatar");
  const name = localStorage.getItem("name");

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
          Bài viết chi tiết
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
          justifyContent: "space-between",
          marginLeft: 2,
          marginRight: 2,
          marginTop: 0.5,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <img
            style={{ width: 40, height: 40, borderRadius: 50 }}
            src={avatarUrl}
            alt="avatar"
          />
          <Box sx={{ lineHeight: 0.5 }}>
            <p style={{ fontWeight: "bold" }}>{name}</p>
            <p style={{ fontWeight: "550", fontSize: 12, color: "#b0b3b8" }}>
              {post.createdAt}
            </p>
          </Box>
        </Box>

        <Typography>
          <strong>ID:</strong> {post._id}
        </Typography>
      </Box>
      <DialogContent
        sx={{ padding: 0, margin: 0, mt: 0.6, ml: 2, mr: 2, mb: 2 }}
      >
        <SlateViewer content={convertContent(post.content)} />
        {post.images?.length > 0 && (
          <ImagesStyleGrid images={post.images.slice(0, 5)} />
        )}
      </DialogContent>
    </Dialog>
  );
}
