import React from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button
} from "@mui/material";

function ValueComfirm({ open, content, onClose }) {
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
            </DialogActions>
        </Dialog>
    );
}

export default ValueComfirm;
