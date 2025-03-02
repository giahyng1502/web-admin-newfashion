import React, { useEffect, useState } from "react";
import {Box, Button, useTheme} from "@mui/material";
import DataTable from "../../components/user-table";
import axios from "../../apis/axios";
import {useDispatch, useSelector,} from "react-redux";
import {createUser, getAll} from "../../redux/reducer/userReducer";
import AddUser from "../../add-user";
import {tokens} from "../../theme";
import {useNotification} from "../../snackbar/NotificationContext";
const utilUser = (data)=> {
    return data.map((user, index) => ({
        ...user,
        id : user._id,
        phoneNumber: user.information?.[0]?.phoneNumber || "",
        address: user.information?.[0]?.address || "",
    }));
}
export const utilUserUpdate = (user)=> {
    return({
        ...user,
        id : user._id,
        phoneNumber: user.information?.[0]?.phoneNumber || "",
        address: user.information?.[0]?.address || "",
    });
}
function Team() {
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [totalUsers, setTotalUsers] = useState(0);
    const [loading, setLoading] = useState(false);
    const rows = useSelector((state)=>state.user.data);
    const dispatch = useDispatch();
    const showNotification = useNotification();
    const [open, setOpen] = useState(false);
    const [newUser, setNewUser] = useState({
        name: "",
        email: "",
        password: "",
    });

    const getData = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`/users/getall`, {
                params: { page: page + 1, limit: pageSize },
            });

            if (res.status === 200) {
                const { data, totalUsers } = res.data;
                const newData = await utilUser(data);
                dispatch(getAll(newData));
                setTotalUsers(totalUsers || 0);
            }
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getData();
    }, [page, pageSize]);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleAddUser = async () => {
        try {
            if (!newUser || !newUser.name || !newUser.email || !newUser.password) {
                console.error("Dữ liệu người dùng không hợp lệ");
                return;
            }

            const res = await axios.post(`/users/register`, newUser);
            if (res.status === 200) {
                await getData()
                showNotification("Thêm người dùng thành công", "success");

                handleClose(); // Đóng modal hoặc form thêm user
            }
        } catch (error) {
            console.error("Lỗi khi thêm người dùng:", error);
        }
    };

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return (
        <Box p={2}>
            <DataTable
                rows={rows}
                isLoading={loading}
                pageSize={pageSize}
                setPageSize={setPageSize}
                page={page}
                setPage={setPage}
                rowCount={totalUsers}
                handleOpenAddUser={handleOpen}
            />
            <AddUser colors={colors}  open={open} handleClose={handleClose} newUser={newUser} setNewUser={setNewUser} handleAddUser={handleAddUser} />
        </Box>
    );
}

export default Team;
