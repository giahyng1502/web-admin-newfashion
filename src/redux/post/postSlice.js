import { createSlice } from "@reduxjs/toolkit";
import { createPost, deletePost, getAllPosts, updatePost } from "./postActions";

const initialState = {
  posts: [],
  rowCount: 0,
  loading: false,
  error: null,
};

const postSlice = createSlice({
  name: "posts",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getAllPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
        state.rowCount = action.payload.length;
      })
      .addCase(getAllPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload);
        state.rowCount += 1;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        const index = state.posts.findIndex(
          (post) => post._id === action.payload._id
        );
        if (index !== -1) {
          state.posts[index] = {
            ...state.posts[index],
            ...action.payload,
          };
        }
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((post) => post._id !== action.payload);
        state.rowCount -= 1;
      });
  },
});

export default postSlice.reducer;
