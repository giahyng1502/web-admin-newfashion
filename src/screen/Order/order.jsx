import React, { useEffect, useState } from "react";
import {Box, TextField, Button, Typography} from "@mui/material";
import TableOrder from "./table-order";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrder } from "../../redux/reducer/orderReducer";

export const utilOrder = (orders) => {
    return orders.map((order) => ({
        id: order._id,
        customer: order.shippingAddress.name,
        orderCode: order.orderCode,
        status: order.status,
        totalPrice: order.totalPrice,
        phoneNumber: order.shippingAddress.phoneNumber,
        shippingAddress: `${order.shippingAddress.address}`,
        statusHistory: order.statusHistory,
        items: order.items,
        dateCreated: order.dateCreated,
        voucherId: order.voucherId,
        point: order.point,
        disCountSale: order.disCountSale,
    }));
};

function Order() {
    const { orders, total } = useSelector((state) => state.order);
    const dispatch = useDispatch();
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [loading, setLoading] = useState(false);
    const [sortModel, setSortModel] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            const sortField = sortModel.length > 0 ? sortModel[0].field : "dateCreated";
            const sortOrder = sortModel.length > 0 ? sortModel[0].sort : "desc";

            await getAllOrder(dispatch, page, pageSize, sortField, sortOrder, search);
            setLoading(false);
        };

        fetchOrders();
    }, [page, pageSize, sortModel, search, dispatch]);
    return (
        <Box p={2}>
            <TableOrder
                rows={orders}
                isLoading={loading}
                setPageSize={setPageSize}
                rowCount={total}
                page={page}
                sortModel={sortModel}
                setSortModel={setSortModel}
                pageSize={pageSize}
                setPage={setPage}
                setSearch={setSearch}
            />
        </Box>
    );
}

export default Order;
