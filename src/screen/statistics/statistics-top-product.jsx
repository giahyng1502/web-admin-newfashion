import React, { useEffect, useState } from 'react';
import axios from "../../apis/axios";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import {
    Box,
    Typography,
    ToggleButton,
    ToggleButtonGroup,
    CircularProgress,
    Table,
    TableBody,
    TableRow,
    TableCell,
    TableContainer,
    TableHead,
    Paper,
    Avatar,
    Grid
} from '@mui/material';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const StatisticsTopProduct = () => {

    const [topProducts, setTopProducts] = useState([]); // Dữ liệu cho top sản phẩm
    const [loadingTopProducts, setLoadingTopProducts] = useState(false); // Biến trạng thái để theo dõi việc tải dữ liệu thống kê


    const fetchTopSelling = async () => {
        setLoadingTopProducts(true);
        try {
            const res = await axios.get('/dashboard/top-selling');
            setTopProducts(res.data.topProducts);
        } catch (err) {
            console.error('Lỗi gọi API top-selling:', err);
            setTopProducts([]);
        } finally {
            setLoadingTopProducts(false);
        }
    };

    useEffect(() => {
        fetchTopSelling();
    }, []);


    if (loadingTopProducts) {
        return (
            <Box sx={{ p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }
    if (!loadingTopProducts && topProducts.length === 0) {
        return (
            <Box sx={{ p: 4 }}>
                <Typography color="error">Không thể tải dữ liệu thống kê sản phẩm.</Typography>
            </Box>
        );
    }
    if (topProducts.length === 0) {
        return (
            <Box sx={{ p: 4 }}>
                <Typography color="error">Không có sản phẩm nào được thống kê.</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 4 }}>
            <TableContainer component={Paper} sx={{ mt: 4 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Ảnh</TableCell>
                            <TableCell>Sản phẩm</TableCell>
                            <TableCell>ID</TableCell>
                            <TableCell align="right">Số lượng đã bán</TableCell>
                            <TableCell align="right">Doanh thu</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {topProducts.map((product) => (
                            <TableRow key={product.productId}>
                                <TableCell>
                                    <Avatar
                                        variant="square"
                                        src={product.image?.[0] || ''}
                                        alt={product.name}
                                        sx={{ width: 56, height: 56 }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body1" fontWeight="bold">
                                        {product.name}
                                    </Typography>
                                </TableCell>
                                <TableCell align="left">
                                    {product.productId}
                                </TableCell>
                                <TableCell align="right">
                                    {product.totalQuantitySold}
                                </TableCell>
                                <TableCell align="right">
                                    {product.totalRevenue.toLocaleString()}₫
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default StatisticsTopProduct;
