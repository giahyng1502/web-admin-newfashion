import {configureStore} from "@reduxjs/toolkit";
import authReducer from "./reducer/authReducer";
import userReducer from "./reducer/userReducer";
import categoryReducer from "./reducer/categoryReducer";
import orderReducer from "./reducer/orderReducer";
import productReducer from "./reducer/productReducer";
import subcateReducer from "./reducer/subcateReducer";

const store = configureStore({
    reducer: {
        auth : authReducer,
        user : userReducer,
        category : categoryReducer,
        order : orderReducer,
        product : productReducer,
        subcate : subcateReducer,
    }
});
export default store;