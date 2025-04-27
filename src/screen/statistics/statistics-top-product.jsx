import React, { useEffect, useState } from 'react';
import axios from "../../apis/axios";
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

const StatisticsTopProduct = () => {
    const [rangeStat, setRangeStat] = useState('day'); // Khoảng thời gian cho thống kê đơn hàng
    const [topProducts, setTopProducts] = useState([]); // Dữ liệu cho top sản phẩm
    const [loadingTopProducts, setLoadingTopProducts] = useState(false); // Biến trạng thái để theo dõi việc tải dữ liệu thống kê


    const fetchTopSelling = async (time) => {
        setLoadingTopProducts(true);
        try {
            const res = await axios.get('/dashboard/top-selling', {
                params: { time }
            });
            console.log(res.data);

            setTopProducts(res.data.topProducts);
        } catch (err) {
            console.error('Lỗi gọi API top-selling:', err);
            setTopProducts([]);
        } finally {
            setLoadingTopProducts(false);
        }
    };

    useEffect(() => {
        fetchTopSelling(rangeStat);
    }, [rangeStat]);

    const handleChangeStat = (event, newRange) => {
        if (newRange !== null) setRangeStat(newRange);
    }

    if (loadingTopProducts) {
        return (
            <Box sx={{ p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 4 }}>
            <ToggleButtonGroup
                value={rangeStat}
                exclusive
                onChange={handleChangeStat}
                sx={{ mb: 3 }}
            >
                <ToggleButton value="day">Ngày</ToggleButton>
                <ToggleButton value="month">Tháng</ToggleButton>
                <ToggleButton value="year">Năm</ToggleButton>
            </ToggleButtonGroup>

            {topProducts.length === 0 ?
                (
                    <>
                        <Typography variant="subtitle2" sx={{ mb: 2 }}>
                            Không có dữ liệu thống kê cho khoảng thời gian này.
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#888' }}>
                            Vui lòng chọn khoảng thời gian khác.
                        </Typography>
                    </>
                )
                :
                (
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
                )
            }
        </Box>
    );
};

export default StatisticsTopProduct;
