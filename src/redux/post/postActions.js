import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../apis/axios";

const API_URL = "/post";

// Thêm bài viết
export const createPost = createAsyncThunk(
  "posts/createPost",
  async (postData, { rejectWithValue }) => {
    try {
      const formFilesData = new FormData();

      postData.images.forEach((fileObj) => {
        formFilesData.append("files", fileObj.file);
      });

      const uploadPromise = axios.post(`/upload`, formFilesData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const uploadRes = await uploadPromise;

      const imageUrls = uploadRes.data.url || [];

      const data = {
        content: postData.content,
        images: imageUrls,
        hashtag: `#${postData.hashtag}`,
      };

      const response = await axios.post(`${API_URL}/create`, data);

      return response.data.data;
    } catch (error) {
      console.error("Lỗi API:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data);
    }
  }
);

// Lấy danh sách bài viết
export const getAllPosts = createAsyncThunk(
  "posts/getAllPosts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/getAll`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Lỗi không xác định"
      );
    }
  }
);

// Cập nhật bài viết
export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async ({ postId, postData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/update/${postId}`, postData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Lỗi không xác định"
      );
    }
  }
);

// Xóa bài viết
export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (postId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/delete/${postId}`);
      return postId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Lỗi không xác định"
      );
    }
  }
);
