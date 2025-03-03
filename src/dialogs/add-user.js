import React from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography} from "@mui/material";

function AddUser({ open, handleClose, newUser, setNewUser, handleAddUser ,colors}) {
    return (
        <Dialog open={open} onClose={handleClose} >
            <div style={{background : colors.primary[400]}}>
            <DialogTitle><Typography variant={'h4'}>Thêm Người Dùng</Typography></DialogTitle>
            <DialogContent >
                <TextField
                    fullWidth margin="dense" label="Họ và Tên"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                />
                <TextField
                    fullWidth margin="dense" label="Email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
                <TextField
                    fullWidth margin="dense" label="Mật khẩu" type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="secondary">Hủy</Button>
                <Button onClick={handleAddUser} color="primary" variant="contained">Thêm</Button>
            </DialogActions>
            </div>
        </Dialog>
    );
}

export default AddUser;
