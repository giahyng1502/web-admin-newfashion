import axios from "axios";

const instance = axios.create({
    baseURL: 'http://160.30.21.59:3000'
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
