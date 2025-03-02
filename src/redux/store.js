import {configureStore} from "@reduxjs/toolkit";
import authReducer from "./reducer/authReducer";
import userReducer from "./reducer/userReducer";

const store = configureStore({
    reducer: {
        auth : authReducer,
        user : userReducer,
    }
});
export default store;