import {
  Box,
  Button,
  IconButton,
  InputBase,
  Paper,
  useTheme,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { VisibilityOutlined } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import { exportToExcel } from "../../../utils/export-excel";
import AddPostModal from "../../../components/AddPostModal";
import { useState } from "react";
import { useDispatch } from "react-redux";
import UpdatePostModal from "../../../components/UpdatePostModal";
import PostDetailModal from "../../../components/PostDetailModal";
import { deletePost, updatePost } from "../../../redux/post/postActions";
import { useNotify } from "../../../hooks/useNotify";
import "./styles.scss";

export default function PostTable({
  isLoading,
  rows,
  pageSize,
  setPageSize,
  page,
  setPage,
  rowCount,
  onRefresh,
}) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [open, setOpen] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const { deleteSuccess } = useNotify();
  const dispatch = useDispatch();

  const handleDeletePost = (postId) => {
    if (window.confirm("Bạn có chắc muốn xóa bài viết này?")) {
      dispatch(deletePost(postId));
      deleteSuccess("bài viết");
    }
  };

  const handleUpdatePost = (postId) => {
    const postIdHasFound = rows.find((p) => p._id === postId);
    if (postIdHasFound) {
      setSelectedPost(postIdHasFound);
      setOpenUpdate(true);
    }
  };

  const columns = [
    { field: "_id", headerName: "ID", width: 180 },
    {
      field: "images",
      headerName: "Hình ảnh",
      width: 100,
      renderCell: (params) => {
        const images = Array.isArray(params.value) ? params.value : [];
        return images.length > 0 ? (
          <img
            src={images[0]}
            alt="Post"
            style={{
              width: 80,
              height: 80,
              objectFit: "cover",
              borderRadius: 5,
              marginTop: 8,
            }}
          />
        ) : (
          "Không có ảnh"
        );
      },
      editable: true,
    },
    { field: "hashtag", headerName: "Nhãn", width: 120, editable: true },
    { field: "createdAt", headerName: "Ngày tạo", width: 150 },
    {
      field: "user",
      headerName: "Người tạo",
      width: 150,
    },
    {
      field: "actions",
      headerName: " ",
      width: 190,
      renderCell: ({ id }) => {
        return (
          <Box className="action-container">
            <IconButton
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                handleDeletePost(id);
              }}
            >
              <DeleteIcon />
            </IconButton>
            <IconButton
              color="success"
              onClick={(e) => {
                e.stopPropagation();
                handleUpdatePost(id);
              }}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              color="default"
              onClick={(e) => {
                e.stopPropagation();
                const post = rows.find((p) => p._id === id);
                if (post) {
                  setSelectedPost(post);
                  setOpenDetail(true);
                }
              }}
            >
              <VisibilityOutlined />
            </IconButton>
          </Box>
        );
      },
    },
  ];

  return (
    <Paper
      sx={{
        height: "80vh",
        width: "100%",
        maxWidth: "1600px",
        padding: 4,
        background: colors.primary[400],
        margin: "auto",
      }}
    >
      <Box display="flex" justifyContent="space-between" width="100%">
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(true)}
          sx={{ marginBottom: 2, marginRight: 2 }}
        >
          Tạo Bài Viết
        </Button>
        <AddPostModal
          open={open}
          handleClose={() => setOpen(false)}
          onSuccess={() => {
            setOpen(false);
            onRefresh();
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => exportToExcel(rows)}
          sx={{ marginBottom: 2 }}
        >
          Xuất Excel
        </Button>
      </Box>
      <DataGrid
        rows={rows}
        hideFooterSelectedRowCount={true}
        loading={isLoading}
        rowCount={rows.length > 0 ? rowCount : 0}
        rowHeight={100}
        getRowId={(row) => row._id || row.index}
        pageSizeOptions={[5, 10, 20, 50, 100]}
        paginationModel={{ page, pageSize }}
        paginationMode="server"
        onPaginationModelChange={(model) => {
          setPage(model.page);
          setPageSize(model.pageSize);
        }}
        columns={columns}
        pagination
        sx={{
          width: "100%",
          height: "60vh",
          "& .MuiDataGrid-root": {
            border: "2px solid #1976d2",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#1976d2",
            fontWeight: "bold",
            fontSize: "16px",
          },
          "& .MuiDataGrid-row": {
            position: "relative",
            overflow: "visible",
            "& .action-container": {
              position: "absolute",
              right: 670,
              gap: 2,
              opacity: 0,
              transition: "opacity 0.2s ease-in-out",
            },
            "&:hover .action-container": {
              opacity: 1,
            },
          },
        }}
      />
      <UpdatePostModal
        open={openUpdate}
        handleClose={() => setOpenUpdate(false)}
        post={selectedPost || {}}
        onUpdate={(updatedPost) => {
          dispatch(
            updatePost({ postId: updatedPost._id, postData: updatedPost })
          );
          setOpenUpdate(false);
        }}
      />
      <PostDetailModal
        open={openDetail}
        handleClose={() => setOpenDetail(false)}
        post={selectedPost || {}}
      />
    </Paper>
  );
}
