import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducer/authReducer";
import userReducer from "./reducer/userReducer";
import categoryReducer from "./reducer/categoryReducer";
import orderReducer from "./reducer/orderReducer";
import postsReducer from "./post/postSlice";
import vouchersReducer from "./voucher/voucherSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    category: categoryReducer,
    order: orderReducer,
    post: postsReducer,
    voucher: vouchersReducer,
  },
});

export default store;
