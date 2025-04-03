import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Autocomplete,
    Grid
} from "@mui/material";

const productInfo = {
    material: "Polyester",
    composition: "100% Polyester",
    sleeveLength: "Dài",
    pattern: "Trơn",
    applicablePeople: "Người lớn",
    sheer: false,
    type: "Phụ kiện đồ lót nữ",
    season: ["Hè", "Thu", "Đông"],
    operationInstruction: "Giặt máy, không sấy khô",
    style: "Casual",
    fabricElasticity: "Có độ co giãn nhẹ",
    weavingMethod: "Dệt kim",
    origin: "Việt Nam",
};

const options = {
    material: ["Cotton", "Polyester", "Len", "Lụa"],
    sleeveLength: ["Ngắn", "Dài", "Không tay"],
    pattern: ["Trơn", "Kẻ sọc", "Chấm bi"],
    applicablePeople: ["Người lớn", "Trẻ em", "Nam", "Nữ"],
    type: ["Phụ kiện đồ lót nữ", "Áo sơ mi", "Quần dài"],
    season: ["Xuân", "Hè", "Thu", "Đông"],
    style: ["Casual", "Formal", "Sport"],
    fabricElasticity: ["Không co giãn", "Co giãn nhẹ", "Co giãn nhiều"],
    weavingMethod: ["Dệt kim", "Dệt thoi"],
    origin: ["Việt Nam", "Trung Quốc", "Hàn Quốc"],
};

function DescriptionDialog({ open, onClose,onSave }) {
    const [product, setProduct] = useState(productInfo);


    const handleChange = (field, value) => {
        setProduct((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSave = () => {
        onSave(product); // Gửi data về component cha
        onClose(); // Đóng Dialog
    };
    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Thông Tin Sản Phẩm</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    {Object.keys(productInfo).map(
                        (key) =>
                            key !== "_id" &&
                            key !== "sheer" && (
                                <Grid item xs={6} key={key}>
                                    {Array.isArray(productInfo[key]) ? (
                                        <Autocomplete
                                            multiple
                                            options={options[key] || []}
                                            value={product[key] || []}
                                            onChange={(e, value) => handleChange(key, value)}
                                            renderInput={(params) => (
                                                <TextField {...params} label={key} variant="outlined" />
                                            )}
                                        />
                                    ) : (
                                        <Autocomplete
                                            freeSolo
                                            options={options[key] || []}
                                            value={product[key] || ""}
                                            onChange={(e, value) => handleChange(key, value)}
                                            renderInput={(params) => (
                                                <TextField {...params} label={key} variant="outlined" />
                                            )}
                                        />
                                    )}
                                </Grid>
                            )
                    )}
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Hủy
                </Button>
                <Button onClick={handleSave} variant="contained" color="primary">
                    Lưu
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default DescriptionDialog;
