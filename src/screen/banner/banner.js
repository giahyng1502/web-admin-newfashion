import React, { useState, useEffect } from 'react';
import {
    Box, Typography, TextField, Button, Grid, Card, CardMedia, CardActions,
    IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadIcon from '@mui/icons-material/CloudUpload';
import axios from "../../apis/axios";
import { uploadImage } from "../../upload/uploadImage";
import { useNotification } from "../../snackbar/NotificationContext";

function BannerManager() {
    const [banners, setBanners] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedBannerId, setSelectedBannerId] = useState(null);
    const showNotification = useNotification();

    const fetchBanners = async () => {
        try {
            const res = await axios.get('/banner/getAll');
            if (res.status === 200) {
                setBanners(res.data.banner);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddBanner = async () => {
        if (!imageFile) return;
        setLoading(true);
        try {
            const imageUrls = await uploadImage([imageFile]);
            const imageUrl = imageUrls[0];
            const res = await axios.post('/banner/create', { imageUrl });

            if (res.status === 200) {
                showNotification("Thêm banner thành công", "success");
                setBanners([res.data.banner, ...banners]);
                setImageFile(null);
                setPreviewUrl('');
            } else {
                showNotification("Thêm banner thất bại", "error");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const confirmDeleteBanner = (bannerId) => {
        setSelectedBannerId(bannerId);
        setDeleteDialogOpen(true);
    };

    const handleDeleteBanner = async () => {
        try {
            const res = await axios.delete(`/banner/delete/${selectedBannerId}`);
            if (res.status === 200) {
                showNotification('Xóa banner thành công', 'success');
                setBanners(banners.filter(b => b._id !== selectedBannerId));
            } else {
                showNotification('Không thể xóa banner', 'error');
            }
        } catch (err) {
            console.error(err);
            showNotification('Không thể xóa banner', 'error');
        } finally {
            setDeleteDialogOpen(false);
        }
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    useEffect(() => {
        if (imageFile) {
            const reader = new FileReader();
            reader.onloadend = () => setPreviewUrl(reader.result);
            reader.readAsDataURL(imageFile);
        } else {
            setPreviewUrl('');
        }
    }, [imageFile]);

    return (
        <Box p={4}>
            {/* Thêm banner */}
            <Box mb={4} display="flex" flexWrap="wrap" gap={2} alignItems="center">
                <Button
                    variant="contained"
                    component="label"
                    startIcon={<UploadIcon />}
                >
                    Chọn ảnh
                    <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={(e) => setImageFile(e.target.files[0])}
                    />
                </Button>

                {previewUrl && (
                    <Card sx={{ width: 200, maxHeight: 120 }}>
                        <CardMedia component="img" image={previewUrl} alt="Preview" sx={{ height: 120 }} />
                    </Card>
                )}

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddBanner}
                    disabled={!imageFile || loading}
                    startIcon={loading && <CircularProgress size={20} />}
                >
                    {loading ? 'Đang thêm...' : 'Thêm'}
                </Button>
            </Box>

            {/* Danh sách banner */}
            <Grid container spacing={3}>
                {banners.map((banner) => (
                    <Grid item xs={12} sm={6} md={4} key={banner._id}>
                        <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                            <CardMedia
                                component="img"
                                height="200"
                                image={banner.imageUrl}
                                alt="Banner"
                            />
                            <CardActions sx={{ justifyContent: 'flex-end' }}>
                                <IconButton color="error" onClick={() => confirmDeleteBanner(banner._id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Dialog xác nhận xoá */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Xác nhận xóa banner</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Bạn có chắc chắn muốn xóa banner này không? Hành động này không thể hoàn tác.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Hủy</Button>
                    <Button onClick={handleDeleteBanner} color="error">Xóa</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default BannerManager;
