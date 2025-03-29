import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar, Typography, Paper } from "@mui/material";
import { utilVietnamDong } from "../../utils/util-vietnam-dong";

function OrderItemsTable({ order }) {
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell align="center">Hình ảnh</TableCell>
                        <TableCell align="center">Sản phẩm</TableCell>
                        <TableCell align="center">Màu sắc</TableCell>
                        <TableCell align="center">Kích thước</TableCell>
                        <TableCell align="center">Số lượng</TableCell>
                        <TableCell align="center">Giá</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {order.item && order.item.length > 0 ? (
                        order.item.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell align="center">
                                    <Avatar
                                        src={item.color.imageColor || "/no-image.png"}
                                        variant="rounded"
                                        sx={{ width: 50, height: 50, margin: "auto" }}
                                    />
                                </TableCell>
                                <TableCell align="center">{item.productName}</TableCell>
                                <TableCell align="center">{item.color.nameColor}</TableCell>
                                <TableCell align="center">{item.size}</TableCell>
                                <TableCell align="center">{item.quantity}</TableCell>
                                <TableCell align="center">{utilVietnamDong(item.price)}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6} align="center">
                                <Typography variant="h5">Không có sản phẩm</Typography>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default OrderItemsTable;
