import {createSlice} from "@reduxjs/toolkit";
import axios from "../../apis/axios";

const statisticsReducer = createSlice({
    name : 'statistics',
    initialState: {
        revenueData: {}
    },
    reducers: {
        getRevenue : (state, action) => {
            state.revenueData = action.payload;
        }
    },
})

export const {getRevenue} = statisticsReducer.actions;
export default statisticsReducer.reducer;

export const getRevenueData = async (time) => { //week, month, year
    try {
        const res = await axios.get("/dashboard/revenue", {
            params: {
                time: time
            }
        });
        if (res.status === 200) {
            console.log(res.data);
            return res.data
        }
        return {};
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
