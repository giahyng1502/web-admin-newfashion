import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Box } from "@mui/material";
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

function ConfirmDelete({ open, onClose, onDelete, title,colors }) {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <Box sx={{ textAlign: "center", mt: 2 }}>
                <WarningAmberIcon sx={{ fontSize: 50, color: "#ff9800" }} />
            </Box>
            <DialogTitle sx={{ textAlign: "center", fontWeight: "bold", color: "#d32f2f" }}>
                <Typography sx={{fontWeight : 'bold'}} variant={'h5'}>Cảnh báo</Typography>
            </DialogTitle>
            <DialogContent>
                <Typography variant="h5" align="center" sx={{ color: colors.grey[100] }}>
                    {title || "Bạn có chắc chắn muốn xóa mục này không?"}
                </Typography>
            </DialogContent>
            <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
                <Button
                    onClick={onClose}
                    sx={{
                        backgroundColor: "#b0bec5",
                        color: "#fff",
                        "&:hover": { backgroundColor: "#78909c" }
                    }}
                >
                    Hủy
                </Button>
                <Button
                    onClick={onDelete}
                    sx={{
                        backgroundColor: "#d32f2f",
                        color: "#fff",
                        "&:hover": { backgroundColor: "#b71c1c" }
                    }}
                >
                    Xóa
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ConfirmDelete;
