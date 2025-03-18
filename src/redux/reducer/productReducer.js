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

export const getProduct = async (dispatch,page,pageSize) => {
    try {
        const res = await axios.get('/',{
            params: {
                page: page+1,
                limit: pageSize,
            }
        });
        if (res && res.data.data.length > 0) {
            let data = {};
            data.products= productData(res.data.data);
            data.totalProducts = res.data.totalProducts;
            console.log(data)
            dispatch(getAllProduct(data))
        }

    }catch(error){
        console.log(error)
    }
}
export const {getAllProduct, addProduct,updateProduct} = productReducer.actions;
export default productReducer.reducer
