import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

const storedToken = localStorage.getItem("token");

let initialState = { name: "", role: "", email: "", loading: false };

if (storedToken) {
  try {
    const decodedUser = jwtDecode(storedToken);
    initialState = { ...decodedUser, loading: false };
  } catch (error) {
    console.error("Lỗi giải mã token:", error);
    localStorage.removeItem("token"); // Xóa token nếu lỗi
  }
}

const authReducer = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      const token = action.payload.token; // Nhận token từ API
      const { avatar, email, name } = action.payload.user;

      localStorage.setItem("avatar", avatar);
      localStorage.setItem("email", email);
      localStorage.setItem("name", name);
      localStorage.setItem("token", token); // Lưu token mới

      try {
        const decodedUser = jwtDecode(token);
        state.name = decodedUser.name || "";
        state.role = decodedUser.role || "";
        state.email = decodedUser.email || "";
      } catch (error) {
        console.error("Lỗi giải mã token:", error);
        localStorage.removeItem("token");
      }
    },
    loginFailure: (state) => {
      state.loading = false;
    },
    logout: (state) => {
      state.name = "";
      state.role = "";
      state.email = "";
      state.loading = false;
      localStorage.removeItem("token");
      localStorage.removeItem("avatar");
      localStorage.removeItem("name");
      localStorage.removeItem("email");
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } =
  authReducer.actions;
export default authReducer.reducer;
