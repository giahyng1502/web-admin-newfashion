import React, { useEffect, useState } from "react";
import { Box, useTheme, TextField, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DataTable from "../../components/user-table";
import axios from "../../apis/axios";
import { useDispatch, useSelector } from "react-redux";
import {getAll, getData} from "../../redux/reducer/userReducer";
import AddUser from "../../dialogs/add-user";
import { tokens } from "../../theme";
import { useNotification } from "../../snackbar/NotificationContext";
import {getAllOrder} from "../../redux/reducer/orderReducer";

export const utilUser = (data) => {
    return data.map((user) => ({
        ...user,
        id: user._id,
    }));
};

export const utilUserUpdate = (user) => ({
    ...user,
    id: user._id,
});

function Team() {
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [sortModel, setSortModel] = useState([]);
    const [open, setOpen] = useState(false);
    const [newUser, setNewUser] = useState({
        name: "",
        email: "",
        password: "",
        role: 0,
        phoneNumber: "",
        address: "",
    });
    const {total,users} = useSelector((state) => state.user);

    const dispatch = useDispatch();
    const showNotification = useNotification();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            const sortField = sortModel.length > 0 ? sortModel[0].field : "createdAt";
            const sortOrder = sortModel.length > 0 ? sortModel[0].sort : "desc";

            await getData(dispatch, page, pageSize, sortField, sortOrder, search);
            setLoading(false);
        };

        fetchOrders();
    }, [page, pageSize, sortModel, search, dispatch]);


    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleAddUser = async () => {
        try {
            if (!newUser.name || !newUser.email || !newUser.password) {
                showNotification("Vui lòng nhập đầy đủ thông tin", "error");
                return;
            }

            const res = await axios.post(`/users/register`, newUser);
            if (res.status === 200) {
                getData();
                showNotification("Thêm người dùng thành công", "success");
                handleClose();
            }
        } catch (error) {
            showNotification("Lỗi khi thêm người dùng", "error");
        }
    };

    return (
        <Box p={2}>

            <DataTable
                rows={users}
                isLoading={loading}
                pageSize={pageSize}
                setPageSize={setPageSize}
                page={page}
                setPage={setPage}
                setSearch={setSearch}
                rowCount={total}
                handleOpenAddUser={handleOpen}
                sortModel={sortModel}
                setSortModel={setSortModel}
            />

            <AddUser
                colors={colors}
                open={open}
                handleClose={handleClose}
                newUser={newUser}
                setNewUser={setNewUser}
                handleAddUser={handleAddUser}
            />
        </Box>
    );
}

export default Team;