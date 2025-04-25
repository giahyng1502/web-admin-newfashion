import { createSlice } from "@reduxjs/toolkit";
import axios from "../../apis/axios";
import { utilUser } from "../../screen/dashboard/team";

const userReducer = createSlice({
  name: "user",
  initialState: {
    total: 0,
    users: [],
  },
  reducers: {
    getAll: (state, action) => {
      state.users = utilUser(action.payload.data);
      state.total = action.payload.total;
    },
    createUser: (state, action) => {
      state.data.push(action.payload);
    },
    deleteUser: (state, action) => {
      state.data = state.data.filter((user) => user._id !== action.payload);
    },
    updateUser: (state, action) => {
      state.users = state.users.map((user) =>
        user._id === action.payload._id ? { ...user, ...action.payload } : user
      );
    },
  },
});
export const getData = async (
  dispatch,
  page,
  pageSize,
  sortField = "createdAt",
  sortOrder = "desc",
  search
) => {
  try {
    const res = await axios.get(`/users/search`, {
      params: {
        page: page + 1,
        limit: pageSize,
        search,
        sortField,
        sortOrder,
      },
    });

    if (res.status === 200) {
      const data = res.data;
      console.log("data: ", data);
      dispatch(getAll(data)); // Cập nhật Redux
    }
  } catch (error) {
    console.log(error);
  }
};
export const { getAll, deleteUser, createUser, updateUser } =
  userReducer.actions;
export default userReducer.reducer;
