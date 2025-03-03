import {configureStore} from "@reduxjs/toolkit";
import authReducer from "./reducer/authReducer";
import userReducer from "./reducer/userReducer";
import categoryReducer from "./reducer/categoryReducer";

const store = configureStore({
    reducer: {
        auth : authReducer,
        user : userReducer,
        category : categoryReducer,
    }
});
export default store;