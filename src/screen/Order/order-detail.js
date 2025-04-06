import React from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
    Divider,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Chip,
} from "@mui/material";
import {utilDatetime} from "../../utils/util-datetime";
import {utilVietnamDong} from "../../utils/util-vietnam-dong";
import OrderItemsTable from "./table-detail";

const OrderDetail = ({ open, setOpen, order, colors }) => {
    const statusLabels = [
        "Đã đặt hàng",
        "Xác nhận đơn hàng",
        "Đã giao cho shipper",
        "Đã giao hàng thành công",
        "Hủy đơn hàng",
        "Hoàn đơn hàng",
        "Đang chờ người dùng thanh toán bằng momo",
        "Đã thanh toán thành công bằng momo",
    ];
    const role = [
        "Người dùng",
        "Nhân Viên",
        "Admin",
    ];


    return (
        <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
            <Box sx={{ background: colors.primary[400], p: 2 }}>
                <DialogTitle>
                    <Typography variant="h4">Chi tiết đơn hàng</Typography>
                </DialogTitle>
                <DialogContent>
                    {order ? (
                        <Box>
                            {/* Mã đơn hàng & Thông tin khách hàng */}
                            <Typography variant="h5" gutterBottom>
                                Mã đơn hàng: {order.orderCode || 'Không tìm thấy mã đơn hàng'}
                            </Typography>
                            <Typography variant="body1">
                                Khách hàng: {order.customer}
                            </Typography>
                            <Typography variant="body1">
                                Số điện thoại: {order.phoneNumber}
                            </Typography>
                            <Typography variant="body1">
                                Phương thức thanh toán: {order?.paymentMethod?.toUpperCase()}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                Địa chỉ giao hàng: {order.shippingAddress}
                            </Typography>
                            <Divider sx={{ my: 2 }} />

                            {/* Danh sách sản phẩm */}
                            <Typography variant="h5" gutterBottom>
                                Sản phẩm trong đơn hàng:
                            </Typography>
                            <OrderItemsTable order={order}/>
                            <Divider sx={{ my: 2 }} />

                            {/* Lịch sử trạng thái đơn hàng */}
                            <Typography variant="h5" gutterBottom>
                                Lịch sử trạng thái:
                            </Typography>
                            <List>
                                {order.statusHistory &&
                                    order.statusHistory.map((history, index) => (
                                        <ListItem key={index}>
                                            <Chip
                                                label={statusLabels[history.status] || "Không xác định"}
                                                color="primary"
                                            />
                                            <Typography sx={{ ml: 2 }}>
                                                {utilDatetime(history.timestamp)}
                                            </Typography>
                                            <ListItemText
                                                sx={{ ml: 2 }}
                                                primary={`Người cập nhật: ${history.updatedBy.name || 'UN'} ( ${role[history.updatedBy.role]} )`}
                                            />
                                        </ListItem>
                                    ))}
                            </List>

                            <Divider sx={{ my: 2 }} />
                            <Typography variant="h5" color={colors.redAccent[500]}>
                                Giá gốc: {utilVietnamDong(order.originalPrice)}
                            </Typography>
                            <Typography variant="h5" color={colors.redAccent[500]}>
                                Giảm giá khuyến mãi voucher: {utilVietnamDong(order.totalVoucherDiscount)}
                            </Typography>
                            <Typography variant="h5" color={colors.redAccent[500]}>
                                Giảm giá từ sản phẩm: {utilVietnamDong(order.totalDiscountSale)}
                            </Typography>
                            <Typography variant="h5" color={colors.redAccent[500]}>
                                Giảm giá từ điểm tiêu dùng: {utilVietnamDong(order.point)}
                            </Typography>
                            <Typography variant="h5" color={colors.redAccent[500]}>
                                Tổng tiền: {utilVietnamDong(order.totalPrice)}
                            </Typography>
                        </Box>
                    ) : (
                        <Typography>Không có dữ liệu</Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        sx={{ background: colors.blueAccent[400], color: "white" }}
                        onClick={() => setOpen(false)}
                    >
                        Đóng
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
};

export default OrderDetail;