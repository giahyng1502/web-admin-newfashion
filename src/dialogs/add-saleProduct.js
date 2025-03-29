import React, {useEffect, useState} from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from "@mui/material";

function AddSaleProduct({ open, onClose, addSaleProduct, product }) {
    const [saleProduct, setSaleProduct] = useState({
        productId: "",
        discount: 0,
        expireAt: 0,
        limit: 0
    });
    useEffect(() => {
        setSaleProduct((prev) => ({
            ...prev,
            productId: product.id
        }));
    },[product])

    // Xử lý thay đổi giá trị của input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setSaleProduct((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle><Typography>Thêm sản phẩm giảm giá</Typography></DialogTitle>
            <DialogContent>
                <TextField
                    type="number"
                    name="discount"
                    label="Giảm giá (%)"
                    variant="outlined"
                    color="secondary"
                    value={saleProduct.discount}
                    onChange={handleChange}
                    fullWidth
                    margin="dense"
                />
                <TextField
                    type="number"
                    name="expireAt"
                    label="Thời gian hết hạn tính theo giờ"
                    variant="outlined"
                    color="secondary"
                    value={saleProduct.expireAt}
                    onChange={handleChange}
                    fullWidth
                    margin="dense"
                />
                <TextField
                    type="number"
                    name="limit"
                    label="Giới hạn"
                    variant="outlined"
                    color="secondary"
                    value={saleProduct.limit}
                    onChange={handleChange}
                    fullWidth
                    margin="dense"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="error">
                    Hủy
                </Button>
                <Button onClick={() => addSaleProduct(saleProduct)} color="primary">
                    Lưu
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default AddSaleProduct;
