import { Box, Button, IconButton, Paper, useTheme } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { VisibilityOutlined } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import { exportToExcel } from "../../../utils/export-excel";
import AddPostModal from "./components/AddPostModal";
import { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import UpdatePostModal from "./components/UpdatePostModal";
import PostDetailModal from "./components/PostDetailModal";
import { deletePost, updatePost } from "../../../redux/post/postActions";
import { useNotify } from "../../../hooks/useNotify";
import SlateViewer from "./components/SlateEditor/SlateViewer";
import { convertContent } from "../../../utils/formattingUtils";
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

  const memoizedPost = useMemo(() => selectedPost, [selectedPost?._id]);

  const handleDeletePost = (postId) => {
    if (window.confirm("Bạn có chắc muốn xóa bài viết này?")) {
      dispatch(deletePost(postId));
      deleteSuccess("bài viết");
    }
  };

  const handleOpenUpdateModal = (id) => {
    const post = rows.find((p) => p._id === id);
    if (!post) return;
    setSelectedPost(post);
    setOpenUpdate(true);
  };

  const handleOpenDetailModal = (id) => {
    const post = rows.find((p) => p._id === id);
    if (!post) return;
    setSelectedPost(post);
    setOpenDetail(true);
  };

  const renderSlateCell = ({ value }) =>
    typeof value === "string" && /<\/?[a-z]/i.test(value) ? (
      <div
        className="post-content"
        dangerouslySetInnerHTML={{ __html: value }}
      />
    ) : (
      <div className="post-content">
        <SlateViewer content={convertContent(value)} />
      </div>
    );

  const ActionButtons = ({ post, onView, onEdit, onDelete }) => (
    <Box className="action-container">
      <IconButton
        onClick={(e) => {
          e.stopPropagation();
          onView(post);
        }}
      >
        <VisibilityOutlined />
      </IconButton>
      <IconButton
        color="success"
        onClick={(e) => {
          e.stopPropagation();
          onEdit(post);
        }}
      >
        <EditIcon />
      </IconButton>
      <IconButton
        color="error"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(post);
        }}
      >
        <DeleteIcon />
      </IconButton>
    </Box>
  );

  const columns = [
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
    {
      field: "content",
      headerName: "Nội dung",
      width: 420,
      renderCell: renderSlateCell,
    },
    {
      field: "hashtag",
      headerName: "Thẻ",
      width: 100,
      renderCell: renderSlateCell,
    },
    {
      field: "createdAt",
      headerName: "Ngày tạo",
      width: 200,
      renderCell: renderSlateCell,
    },
    {
      field: "user",
      headerName: "Người tạo",
      width: 130,
      renderCell: ({ value }) => {
        return <div className="post-content">{value || "—"}</div>;
      },
    },
    {
      field: "actions",
      headerName: " ",
      width: 190,
      renderCell: ({ id }) => (
        <ActionButtons
          post={id}
          onDelete={handleDeletePost}
          onEdit={handleOpenUpdateModal}
          onView={handleOpenDetailModal}
        />
      ),
    },
  ];

  return (
    <Paper
      sx={{
        height: "80vh",
        width: "96%",
        maxWidth: "1200px",
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
        getRowHeight={() => "auto"}
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
        post={memoizedPost}
        onUpdate={async (updatedPost) => {
          if (!updatedPost) return;
          try {
            await dispatch(
              updatePost({ postId: updatedPost._id, postData: updatedPost })
            ).unwrap();
            await onRefresh();
            setOpenUpdate(false);
          } catch (error) {
            console.error("Error updating post:", error);
          }
        }}
      />
      <PostDetailModal
        open={openDetail}
        handleClose={() => setOpenDetail(false)}
        post={memoizedPost}
      />
    </Paper>
  );
}
