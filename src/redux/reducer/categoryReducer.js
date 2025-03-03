import {createSlice} from "@reduxjs/toolkit";
import axios from "../../apis/axios";
import {useNotification} from "../../snackbar/NotificationContext";
const categoryReducer = createSlice({
    name : 'category',
    initialState: {
        data : []
    },
    reducers: {
        getAll : (state, action) => {
            state.data = action.payload;
        },
        add : (state, action) => {
          state.data.push(action.payload);
        },
        update : (state, action) => {
            state.data = state.data.map((data) =>
                data._id === action.payload._id ? { ...data, ...action.payload } : data
            );
        },
        deleteCate : (state, action) => {
            state.data = state.data.filter((data) =>
                data._id !== action.payload
            );
        },
    },
})

export const {getAll,update,deleteCate,add} = categoryReducer.actions;
export default categoryReducer.reducer;
export const getCategories = async () => {
    try {
        const res = await axios.get("category")
        if (res.status === 200) {
            return res.data.data
        }
        return [];
    }catch (error) {
        console.log(error)
    }
}
export const addCategory = async (category,files) => {
    try {
        if (files) {}
        const formData = new FormData();
        formData.append("categoryName", category.categoryName);
        formData.append("files", files);
        const res = await axios.post("category", formData,{
            headers: { "Content-Type": "multipart/form-data" }
        });
        if (res.status === 201) {
            return {
                message : 'Thêm sản phẩm thành công',
                type: 'success',
                data : res.data.data
            };
        }
        return {
            message : 'Thêm sản phẩm thất bại',
            type: 'error',
        };

    }catch (error) {
        console.log(error)
        return {
            message : `Thêm sản phẩm thất bại,${error}`,
            type: 'error',
        };

    }
}
