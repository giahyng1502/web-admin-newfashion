import axios from "axios";

const instance = axios.create({
    baseURL: 'https://api.hungcy.id.vn'
    // baseURL: 'http://localhost:3000'
});

// Thêm interceptor để tự động chèn token vào mỗi reque
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token"); // Lấy token từ localStorage
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default instance;
