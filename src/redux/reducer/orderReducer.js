import {createSlice} from "@reduxjs/toolkit";
import axios from "../../apis/axios";
import {utilOrder} from "../../screen/Order/order";

const orderReducer = createSlice({
    name: "order",
    initialState: {
        orders: [],
        totalProducts: 0,
    },
    reducers : {
        getOrders: (state, action) => {
            state.orders = action.payload;
            state.totalProducts = action.payload.totalProducts;
        },
        updateOrders: (state, action) => {
            state.orders = state.orders.map(order =>
                order.id === action.payload.id
                    ? { ...order, status: action.payload.status }
                    : order
            );
        }

    },
})
export const getAllOrder = async (dispatch) => {
    try {
        const res = await axios.get("/order/getAll");
        if (res.status === 200) {
            const order = utilOrder(res.data.data)
            order.totalProducts = res.data.totalProducts;
            dispatch(getOrders(order));
        }
    }catch(error) {
        console.log(error)
    }
}
export const updateStatus = async (id,value,dispatch,showNotification) => {
    try {
        const res = await axios.put(`/order/update/${id}`, {
            status: value,
        })
        if (res.status === 200) {
            showNotification('Đã cập nhập đơn hàng thành công');
            dispatch(updateOrders({id,status : value}))
        }
    }catch(error) {
        console.log(error)
    }
}
export const {getOrders,updateOrders} = orderReducer.actions
export default orderReducer.reducer;