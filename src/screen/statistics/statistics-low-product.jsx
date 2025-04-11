import React, { useEffect, useState } from 'react';
import axios from "../../apis/axios";
import {
    Box,
    Typography,
    Card,
    CardMedia,
    CardContent,
    Grid,
    CircularProgress,
    Table,
    TableBody,
    TableRow,
    TableCell
} from '@mui/material';

const StatisticsLowProduct = () => {
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [loadingLowStock, setLoadingLowStock] = useState(false);

    const fetchLowStockProducts = async () => {
        setLoadingLowStock(true);
        try {
            const res = await axios.get("/dashboard/low-product");
            setLowStockProducts(res.data.data || []);
        } catch (error) {
            console.error("Lỗi khi gọi API low-product:", error);
        } finally {
            setLoadingLowStock(false);
        }
    };

    useEffect(() => {
        fetchLowStockProducts();
    }, []);

    if (loadingLowStock) {
        return (
            <Box sx={{ p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!loadingLowStock && lowStockProducts.length === 0) {
        return (
            <Box sx={{ p: 4 }}>
                <Typography variant="h6">Không có sản phẩm nào sắp hết hàng.</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>
                Sản phẩm sắp hết hàng
            </Typography>

            {lowStockProducts && (
                <Table sx={{ mt: 2 }}>
                    <TableBody>
                        <TableRow>
                            <TableCell><strong>ID</strong></TableCell>
                            <TableCell><strong>Hình ảnh</strong></TableCell>
                            <TableCell><strong>Tên sản phẩm</strong></TableCell>
                            <TableCell><strong>Còn lại</strong></TableCell>
                            <TableCell><strong>Đã bán</strong></TableCell>
                        </TableRow>
                        {lowStockProducts.map((product) => (
                            <TableRow key={product._id}>
                                <TableCell sx={{fontSize: 16}}>{product._id}</TableCell>
                                <TableCell>
                                    <img
                                        src={product.image?.[0]}
                                        alt={product.name}
                                        style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4 }}
                                    />
                                </TableCell>
                                <TableCell style={{ maxWidth: 300, fontSize: 16, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {product.name}
                                </TableCell>
                                <TableCell sx={{ color: 'red', fontSize: 16 }}>{product.stock}</TableCell>
                                <TableCell sx={{fontSize: 16}}>{product.sold}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}

        </Box>
    );
};

export default StatisticsLowProduct;
