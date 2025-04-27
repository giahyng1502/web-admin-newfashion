import React from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button
} from "@mui/material";

function ConfirmDialog({ open, content, onClose, onConfirm }) {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Thông báo</DialogTitle>
            <DialogContent>
                <DialogContentText>{content}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant={'contained'} color="secondary">
                    Đóng
                </Button>
                <Button onClick={onConfirm} variant={'contained'} color="primary">
                    Xác nhận
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ConfirmDialog;
