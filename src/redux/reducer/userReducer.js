import { createSlice } from "@reduxjs/toolkit";

const userReducer = createSlice({
    name: "user",
    initialState: {
        data: [],
    },
    reducers: {
        getAll: (state, action) => {
            state.data = action.payload;
        },
        createUser: (state, action) => {
            state.data.push(action.payload);
        },
        deleteUser: (state, action) => {
            state.data = state.data.filter((user) => user._id !== action.payload);
        },
        updateUser: (state, action) => {
            state.data = state.data.map((user) =>
                user._id === action.payload._id ? { ...user, ...action.payload } : user
            );
        }
    }
});

export const { getAll, deleteUser,createUser, updateUser } = userReducer.actions;
export default userReducer.reducer;
