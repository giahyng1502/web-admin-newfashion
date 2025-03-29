import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import TableOrder from "./table-order";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrder } from "../../redux/reducer/orderReducer";
export const utilOrder = (orders) => {
  return orders.map((order) => ({
    id: order._id,
    customer: order.shippingAddress.name,
    status: order.status,
    totalPrice: order.totalPrice,
    shippingAddress: `${order.shippingAddress.phoneNumber} \n${order.shippingAddress.address}`,
    productDesc: order.item
      .map(
        (data) =>
          `- X${data.quantity} ${data.productName} màu ${data.color.nameColor} cỡ ${data.size} `
      )
      .join("\n"),
    statusHistory: order.statusHistory,
    item: order.item,
    voucherId: order.voucherId,
    point: order.point,
    disCountSale: order.disCountSale,
  }));
};

function Order(props) {
  const { orders, totalProducts } = useSelector((state) => state.order);
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getAllOrder(dispatch).then((response) => {
      setLoading(false);
    });
    setLoading(false);
  }, [dispatch]);

  return (
    <Box p={2}>
      <TableOrder
        rows={orders}
        isLoading={loading}
        setPageSize={setPageSize}
        rowCount={totalProducts}
        page={page}
        pageSize={pageSize}
        setPage={setPage}
      />
    </Box>
  );
}

export default Order;
