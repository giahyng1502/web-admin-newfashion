import React, { useState } from "react";
import { TextField, Paper, List, ListItem, ListItemText } from "@mui/material";

const CustomAutocomplete = ({ onSelect, subcate }) => {
    const [inputValue, setInputValue] = useState("");
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [isFocused, setIsFocused] = useState(false); // Kiểm tra focus

    // Xử lý nhập dữ liệu
    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value);

        // Lọc danh sách khi nhập
        const filtered = subcate.filter((item) =>
            item.subCateName.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredOptions(filtered);
    };

    // Xử lý chọn danh mục
    const handleSelect = (option) => {
        setInputValue(option.subCateName); // Hiển thị tên danh mục đã chọn
        setFilteredOptions([]); // Ẩn danh sách gợi ý
        setIsFocused(false); // Ẩn danh sách sau khi chọn
        onSelect(option); // Gửi dữ liệu về component cha
    };

    return (
        <div style={{ position: "relative", width: "100%" }}>
            <TextField
                label="Chọn thể loại sản phẩm"
                variant="outlined"
                color="secondary"
                fullWidth
                value={inputValue}
                onChange={handleInputChange}
                onFocus={() => setIsFocused(true)} // Hiện danh sách khi focus
                onBlur={() => setTimeout(() => setIsFocused(false), 150)} // Ẩn danh sách khi mất focus
            />
            {/* Hiển thị danh sách gợi ý nếu đang focus và có kết quả */}
            {isFocused && (
                <Paper
                    style={{
                        position: "absolute",
                        width: "100%",
                        zIndex: 10,
                        maxHeight: 200,
                        overflowY: "auto",
                    }}
                    onMouseDown={(e) => e.preventDefault()} // Ngăn onBlur kích hoạt trước khi chọn
                >
                    <List>
                        {filteredOptions.map((option) => (
                            <ListItem
                                key={option._id}
                                button
                                onClick={() => handleSelect(option)}
                            >
                                <ListItemText primary={option.subCateName} />
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            )}
        </div>
    );
};

export default CustomAutocomplete;
