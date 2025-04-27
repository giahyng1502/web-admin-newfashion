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
    TableCell
} from '@mui/material';

const StatisticsOrder = () => {
    const [rangeOrderStat, setRangeOrderStat] = useState('week'); // Khoảng thời gian cho thống kê đơn hàng
    const [orderStats, setOrderStats] = useState(null); // Dữ liệu cho thống kê đơn hàng
    const [loadingOrderStat, setLoadingOrderStat] = useState(false); // Biến trạng thái để theo dõi việc tải dữ liệu thống kê

    const fetchOrderStats = async (time) => {
        setLoadingOrderStat(true);
        try {
            const res = await axios.get("/dashboard/order-stats", {
                params: { time }
            });
            setOrderStats(res.data);
        } catch (err) {
            console.error("Lỗi gọi API order-stats:", err);
            setOrderStats(null);
        } finally {
            setLoadingOrderStat(false);
        }
    };

    useEffect(() => {
        fetchOrderStats(rangeOrderStat);
        console.log("Thống kê đơn hàng:", orderStats);

    }, [rangeOrderStat]);

    const handleChangeOrderStat = (event, newRange) => {
        if (newRange !== null) setRangeOrderStat(newRange);
    }

    if (loadingOrderStat) {
        return (
            <Box sx={{ p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 4 }}>
            <ToggleButtonGroup
                value={rangeOrderStat}
                exclusive
                onChange={handleChangeOrderStat}
                sx={{ mb: 3 }}
            >
                <ToggleButton value="week">Tuần</ToggleButton>
                <ToggleButton value="month">Tháng</ToggleButton>
                <ToggleButton value="year">Năm</ToggleButton>
            </ToggleButtonGroup>

            {(orderStats === null || orderStats.length === 0) ?
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
                : (
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell>Tổng đơn</TableCell>
                                <TableCell>{orderStats.totalOrders}</TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Đơn đang chờ</TableCell>
                                <TableCell>{orderStats.stats.pending}</TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Đơn đang giao</TableCell>
                                <TableCell>{orderStats.stats.shipping}</TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Đã giao</TableCell>
                                <TableCell>{orderStats.stats.delivered}</TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Đã huỷ</TableCell>
                                <TableCell>{orderStats.stats.canceled}</TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Hoàn trả</TableCell>
                                <TableCell>{orderStats.stats.returned}</TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Tỉ lệ thành công</TableCell>
                                <TableCell>{orderStats.successRate}</TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Tỉ lệ huỷ</TableCell>
                                <TableCell>{orderStats.cancelRate}</TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                )}
        </Box>
    );
};

export default StatisticsOrder;
