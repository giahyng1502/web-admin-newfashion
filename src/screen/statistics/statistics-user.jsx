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

const StatisticsUser = () => {

    const [rangeForUserStat, setRangeForUserStat] = useState('today'); // Khoảng thời gian cho thống kê người dùng
    const [statsData, setStatsData] = useState(null); // Dữ liệu cho thống kê người dùng
    const [loadingUserStat, setLoadingUserStat] = useState(false); // Biến trạng thái để theo dõi việc tải dữ liệu thống kê người dùng

    const fetchUserStats = async (time) => {
        setLoadingUserStat(true);
        try {
            const response = await axios.get(`/dashboard/user-stats`, {
                params: { time }
            });
            setStatsData(response.data);
        } catch (error) {
            console.error("Failed to fetch user stats:", error);
        } finally {
            setLoadingUserStat(false);
        }
    };

    const pieData = statsData ? [
        { name: 'Admin', value: statsData.totalAdmin },
        { name: 'Nhân viên', value: statsData.totalStaff },
        { name: 'Người dùng', value: statsData.normalUser }
    ] : [];

    useEffect(() => {
        fetchUserStats(rangeForUserStat);
    }, [rangeForUserStat]);

    const handleChangeUserStat = (event, newRange) => {
        if (newRange) {
            setRangeForUserStat(newRange);
        }
    };

    if (loadingUserStat) {
        return (
            <Box sx={{ p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!loadingUserStat && !statsData) {
        return (
            <Box sx={{ p: 4 }}>
                <Typography color="error">Không thể tải dữ liệu thống kê người dùng.</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 4 }}>
            <Box sx={{ p: 4 }}>
                <ToggleButtonGroup
                    value={rangeForUserStat}
                    exclusive
                    onChange={handleChangeUserStat}
                    sx={{ mb: 3 }}
                >
                    <ToggleButton value="today">Hôm nay</ToggleButton>
                    <ToggleButton value="week">Tuần</ToggleButton>
                    <ToggleButton value="month">Tháng</ToggleButton>
                    <ToggleButton value="year">Năm</ToggleButton>
                </ToggleButtonGroup>

                {statsData ? (
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Paper elevation={3} sx={{ p: 3 }}>
                                <Typography variant="h5" gutterBottom>Chi tiết</Typography>
                                <Typography>👤 Người dùng mới: <b>{statsData.newUsers}</b></Typography>
                                <Typography>🧑‍💼 Admin: <b>{statsData.totalAdmin}</b></Typography>
                                <Typography>👨‍🔧 Nhân viên: <b>{statsData.totalStaff}</b></Typography>
                                <Typography>🙋 Người dùng thường: <b>{statsData.normalUser}</b></Typography>
                                <Typography>📈 Tăng trưởng: <b>{statsData.userGrowth.percentageOfTotal}</b></Typography>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Paper elevation={3} sx={{ p: 3 }}>
                                <Typography variant="h5" gutterBottom>Biểu đồ tỉ lệ</Typography>
                                <ResponsiveContainer width="100%" height={320}>
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={120}
                                            label
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>

                            </Paper>
                        </Grid>
                    </Grid>
                ) : (
                    <Typography>Không có dữ liệu</Typography>
                )}
            </Box>
        </Box>
    );
};

export default StatisticsUser;
