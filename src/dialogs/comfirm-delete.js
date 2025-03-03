import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

function ConfirmDelete({ open, onClose, onDelete,title }) {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogContent>{title}</DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Hủy</Button>
                <Button onClick={onDelete} color="error">Xóa</Button>
            </DialogActions>
        </Dialog>
    );
}

export default ConfirmDelete;
