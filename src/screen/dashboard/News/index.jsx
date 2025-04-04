import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import PostTable from "./postManagement";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts } from "../../../redux/post/postActions";

export default function News() {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const { posts, loading, rowCount } = useSelector((state) => state.post);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllPosts());
  }, [dispatch]);

  const rows = posts.map((post) => ({
    ...post,
    user: post.user.name,
    createdAt: new Date(post.createdAt).toLocaleString(),
  }));

  const handleRefreshPosts = () => {
    dispatch(getAllPosts());
  };

  return (
    <Box p={2}>
      <PostTable
        rows={rows}
        isLoading={loading}
        pageSize={pageSize}
        setPageSize={setPageSize}
        page={page}
        setPage={setPage}
        rowCount={rowCount}
        onRefresh={handleRefreshPosts}
      />
    </Box>
  );
}
