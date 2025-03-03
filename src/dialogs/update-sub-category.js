import React, { useState } from "react";
import {
    Avatar,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Typography
} from "@mui/material";

function UpdateSubCategory({ open, handleClose, subCate, setSubCate, handleUpdate, colors,title,type }) {
    const [selectedFile, setSelectedFile] = useState(null);

    // Xử lý chọn file
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setSubCate({ ...subCate, subImage: URL.createObjectURL(file) }); // Hiển thị ảnh trước khi upload
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <div style={{ background: colors.primary[400], padding: "16px", borderRadius: "8px" }}>
                <DialogTitle>
                    <Typography variant="h5" fontWeight="bold">
                        {title}
                    </Typography>
                </DialogTitle>
                <DialogContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                    {/* Hiển thị ảnh danh mục */}
                    <Avatar src={subCate?.subImage || ""} sx={{ width: '15vh', height: '15vh', mb: 1 }} />

                    {/* Chọn ảnh */}
                    <Button variant="outlined" color={colors.blueAccent[400]} component="label">
                        Chọn ảnh
                        <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                    </Button>

                    {/* Tên danh mục */}
                    <TextField
                        fullWidth
                        margin="dense"
                        label="Tên danh mục"
                        value={subCate?.subCateName || ""}
                        onChange={(e) => setSubCate({ ...subCate, subCateName: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary" variant="outlined">
                        Hủy
                    </Button>
                    <Button onClick={() => handleUpdate(selectedFile,type)} color="primary" variant="contained">
                        Cập Nhật
                    </Button>
                </DialogActions>
            </div>
        </Dialog>
    );
}

export default UpdateSubCategory;
