import axios from "../apis/axios";

export const uploadImage = async (files) => {
    const formData = new FormData();

    // 🟢 Thêm tất cả ảnh vào formData
    files.forEach(file => formData.append("files", file));

    try {
        const response = await axios.post("/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });


        return response.data.url; // API trả về danh sách URL ảnh đã upload
    } catch (error) {
        console.error("Lỗi upload ảnh:", error);
        return [];
    }
};
