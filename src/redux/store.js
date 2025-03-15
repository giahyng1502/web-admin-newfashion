import {configureStore} from "@reduxjs/toolkit";
import authReducer from "./reducer/authReducer";
import userReducer from "./reducer/userReducer";
import categoryReducer from "./reducer/categoryReducer";
import orderReducer from "./reducer/orderReducer";

const store = configureStore({
    reducer: {
        auth : authReducer,
        user : userReducer,
        category : categoryReducer,
        order : orderReducer,
    }
});
export default store;