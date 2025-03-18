import {createSlice} from "@reduxjs/toolkit";
import axios from "../../apis/axios";

const subCateReducer = createSlice({
    name : 'subCateReducer',
    initialState: {
        subcate : [],
    },
    reducers: {
        getAllSubCate: (state, action) => {
            state.subcate = action.payload;
        }
    }
})
export const getSubcate = async () => {
    try {
        const res = await axios.get('/subcategory/getSubCate/getall')
        if (res.status === 200) {
            return res.data.data
        }
        return [];
    }catch(error) {
        console.log(error);
    }
}
export const {getAllSubCate} = subCateReducer.actions;
export default subCateReducer.reducer;
