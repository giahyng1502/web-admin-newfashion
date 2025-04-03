import {createSlice} from "@reduxjs/toolkit";
import axios from "../../apis/axios";
import {productData} from "../../screen/product/product";

const productReducer = createSlice({
    name: "product",
    initialState: {
        products: [],
        totalProducts: 0,
    },
    reducers : {
        getAllProduct : (state, action) =>{
            state.products = action.payload.products;
            state.totalProducts = action.payload.totalProducts;
        },
        addProduct : (state, action) =>{
            state.products.push(action.payload);
        },
        updateProduct : (state, action) =>{
            state.products.map((product) =>
                product.id === action.payload.id ? {...product , ...action.payload} : product
            )
            console.log(action.payload);
        }
    }
})

export const getProduct = async (dispatch, page, pageSize, search = "", minPrice = "", maxPrice = "", sortField = "createdAt", sortOrder = "desc") => {
    try {
        const res = await axios.get("/search", {
            params: {
                page: page + 1,
                limit: pageSize,
                search,  // Tìm kiếm theo tên hoặc ID
                minPrice,
                maxPrice,
                sortField, // Trường cần sắp xếp (giá, số lượng bán, ngày tạo,...)
                sortOrder, // Thứ tự tăng/giảm
            },
        });

        if (res && res.data.data.length > 0) {
            let data = {
                products: productData(res.data.data),
                totalProducts: res.data.total,
            };
            console.log("Fetched data:", data);
            dispatch(getAllProduct(data));
        } else {
            dispatch(getAllProduct({ products: [], totalProducts: 0 }));
        }
    } catch (error) {
        console.error("Lỗi khi fetch sản phẩm:", error);
    }
};

export const {getAllProduct, addProduct,updateProduct} = productReducer.actions;
export default productReducer.reducer
