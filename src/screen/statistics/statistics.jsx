import React, { useEffect, useState } from 'react';
import axios from "../../apis/axios";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
    Box,
    Typography,
    ToggleButton,
    ToggleButtonGroup,
    CircularProgress,
} from '@mui/material';

const Statistics = () => {
    const [rangeRevenue, setRangeRevenue] = useState('week'); // Khoảng thời gian cho biểu đồ doanh thu
    const [data, setData] = useState([]); // Dữ liệu cho biểu đồ doanh thu
    const [dateRange, setDateRange] = useState({ from: '', to: '' }); // Dữ liệu cho khoảng thời gian của biểu đồ doanh thu
    const [loadingRevenue, setLoadingRevenue] = useState(false); // Biến trạng thái để theo dõi việc tải dữ liệu doanh thu

    const fetchStatistics = async (time) => {
        setLoadingRevenue(true);
        try {
            const res = await axios.get("/dashboard/revenue", {
                params: {
                    time: time
                }
            });
            console.log(res.data);

            setData(res.data.data);
            setDateRange({ from: res.data.from, to: res.data.to });
        } catch (err) {
            console.error('Lỗi gọi API:', err);
            setData([]);
        }
        setLoadingRevenue(false);
    };


    useEffect(() => {
        fetchStatistics(rangeRevenue);
    }, [rangeRevenue]);


    const handleChangeRevenue = (event, newRange) => {
        if (newRange !== null) setRangeRevenue(newRange);
    };

    if (loadingRevenue) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }



    return (
        <Box sx={{ p: 4 }}>
            <ToggleButtonGroup
                value={rangeRevenue}
                exclusive
                onChange={handleChangeRevenue}
                sx={{ mb: 3 }}
            >
                <ToggleButton value="week">Tuần</ToggleButton>
                <ToggleButton value="month">Tháng</ToggleButton>
                <ToggleButton value="year">Năm</ToggleButton>
            </ToggleButtonGroup>

            {data.length === 0 ?
                (
                    <>
                        <Typography variant="subtitle2" sx={{ mb: 2 }}>
                            Không có dữ liệu thống kê cho khoảng thời gian này.
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#888' }}>
                            Vui lòng chọn khoảng thời gian khác.
                        </Typography>
                    </>
                ) :
                (
                    <>
                        <Typography variant="subtitle2" sx={{ mb: 2 }}>
                            Từ {dateRange.from} đến {dateRange.to}
                        </Typography>

                        <ResponsiveContainer width="100%" height={400}>
                            <LineChart
                                data={data}
                                margin={{ top: 20, right: 40, left: 0, bottom: 0 }}
                            >
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                    </linearGradient>
                                </defs>

                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="label" />
                                <YAxis />
                                <Tooltip
                                    content={({ active, payload, label }) => {
                                        if (active && payload && payload.length > 0) {
                                            const { totalRevenue, totalOrders } = payload[0].payload;

                                            return (
                                                <Box
                                                    sx={{
                                                        backgroundColor: 'white',
                                                        boxShadow: 3,
                                                        p: 2,
                                                        borderRadius: 2,
                                                        minWidth: 200,
                                                        border: '1px solid #eee'
                                                    }}
                                                >
                                                    <Typography variant="subtitle2" color="black" gutterBottom>
                                                        📅 {label}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 500 }}>
                                                        💰 Doanh thu: {totalRevenue.toLocaleString('vi-VN')}₫
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ color: '#1976d2', fontWeight: 500 }}>
                                                        🛒 Đơn hàng: {totalOrders}
                                                    </Typography>
                                                </Box>
                                            );
                                        }

                                        return null;
                                    }}
                                />

                                <Legend />

                                <Line
                                    type="monotone"
                                    dataKey="totalRevenue"
                                    stroke="#8884d8"
                                    strokeWidth={3}
                                    dot={{ r: 4 }}
                                    activeDot={{ r: 6 }}
                                    name='Doanh thu'
                                />
                            </LineChart>
                        </ResponsiveContainer>

                    </>
                )}
        </Box>
    );
};

export default Statistics;
