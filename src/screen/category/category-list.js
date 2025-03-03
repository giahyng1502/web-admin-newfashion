import React, { useEffect, useState } from "react";
import {
    Grid,
    Paper,
    Card,
    CardMedia,
    CardContent,
    Typography,
    Box,
    Button, IconButton,
} from "@mui/material";
import axios from "../../apis/axios";
import {DeleteOutline, UpdateOutlined} from "@mui/icons-material";
import ConfirmDelete from "../../dialogs/comfirm-delete";
import {useNotification} from "../../snackbar/NotificationContext";
import UpdateSubCategory from "../../dialogs/update-sub-category";
import UpdateCategory from "../../dialogs/update-category";
import {add, addCategory, deleteCate, update} from "../../redux/reducer/categoryReducer";

const CategoryList = ({ colors, categories ,dispatch}) => {
    const [selectedCategory, setSelectedCategory] = useState(null);

    const [category, setCategory] = useState(null);

    const [subcate, setSubcate] = useState([]);
    const [selectedSubCate, setSelectedSubCate] = useState(null); // Lưu danh mục con được chọn
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openDeleteDialogCate, setOpenDeleteDialogCate] = useState(false);
    const [subCateToDelete, setSubCateToDelete] = useState(null);
    const showNotification = useNotification();
    const handleDeleteClick = (subCateId) => {
        setSubCateToDelete(subCateId);
        setOpenDeleteDialog(true);
    };
    const handleDeleteClickCate = () => {
        setOpenDeleteDialogCate(true);
    };
    const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
    const [openAddSubDialog, setOpenAddSubDialog] = useState(false);
    const [openAddDialog, setOpenAddDialog] = useState(false);

    const [openUpdateDialogCate, setOpenUpdateDialogCate] = useState(false);

    const [subCateToUpdate, setSubCateToUpdate] = useState(null);

    const handleUpdateClick = (subCate) => {
        setSubCateToUpdate(subCate);
        setOpenUpdateDialog(true);
    };
    const handleAddCategory = async (category,files)=> {
        const check = await addCategory(category,files);
            showNotification(check.message,check.type);
            setOpenAddDialog(false)
            if (check.type === 'success') {
                dispatch(add(check.data))
            }
    }
    const handleAddCate = () => {
        setOpenAddDialog(true);
    };
    const handleAddSubCate = () => {
        setOpenAddSubDialog(true);
    };
    const handleUpdateSubCategory = async (file,type) => {
        if (!subCateToUpdate) return;

        const formData = new FormData();
        formData.append("subCateName", subCateToUpdate.subCateName);
        formData.append("categoryId",selectedCategory._id);
        if (file) formData.append("files", file);

        try {
            if (type === 0) {
                const res = await axios.put(`subcategory/${subCateToUpdate._id}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                if (res.status === 200) {
                    showNotification('Sửa danh mục sản phẩm thành công','success');
                    getSubCategories(); // Load lại danh sách
                }
            }
            else {
                const res = await axios.post(`subcategory`, formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                if (res.status === 200) {
                    showNotification('Thêm danh mục sản phẩm thành công','success');
                    getSubCategories(); // Load lại danh sách
                }
            }

        } catch (error) {
            console.log(error);
            showNotification('Sửa danh mục sản phẩm thất bại','error');
        }
        setOpenUpdateDialog(false);
    };
    const handleDelete = async () => {
        if (!subCateToDelete) return;
        try {
            const res = await axios.delete(`subcategory/${subCateToDelete}`);
            if (res.status === 200) {
                getSubCategories();
                showNotification('Xóa danh mục sản phẩm con thành công', 'success');
            }
            if (res.status === 401) {
                showNotification('Bạn vui lòng xóa hết sản phẩm tồn tại trong danh mục con này', 'error');
            }
        } catch (error) {
            console.log(error);
            showNotification('Bạn vui lòng xóa hết sản phẩm tồn tại trong danh mục con này', 'error');

        }
        setOpenDeleteDialog(false);
    };
    const handleDeleteCate = async () => {
        if (!selectedCategory) return;
        try {
            const res = await axios.delete(`category/${selectedCategory._id}`);
            if (res.status === 200) {
                showNotification('Xóa danh mục sản phẩm con thành công', 'success');
                dispatch(deleteCate(selectedCategory._id));
                setOpenDeleteDialogCate(false);
            }
        } catch (error) {
            console.log(error);
            showNotification(error.toString(), 'error');

        }
        setOpenDeleteDialog(false);
    };

    const handlOpenMoDalCategory = () => {
        setOpenUpdateDialogCate(true);
    };
const handleUpdateCate =async ()=> {
    try {
        const res = await axios.put(`category/${selectedCategory._id}`,{
            categoryName: selectedCategory.categoryName,
        });
        if (res.status === 200) {
            showNotification('Sửa danh mục thể loại sản phẩm thành công', 'success');
            dispatch(update(res.data.data))
            setOpenUpdateDialogCate(false);
        }
    }catch(err) {
        console.log(err);
    }
}

    const getSubCategories = async () => {
        if (!selectedCategory) return;
        try {
            const res = await axios.get(`subcategory/${selectedCategory._id}`);
            if (res.status === 200) {
                setSubcate(res.data.data.subCategory);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getSubCategories();
    }, [selectedCategory]);

    return (
        <Grid container spacing={2} sx={{ width: "100%", height: "80vh", margin: "auto" }}>
            <ConfirmDelete
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
                onDelete={handleDelete}
                title={'Bạn có chắc chắn muốn xóa danh mục sản phẩm này không'}
            />
            <ConfirmDelete
                open={openDeleteDialogCate}
                onClose={() => setOpenDeleteDialogCate(false)}
                onDelete={handleDeleteCate}
                title={'Bạn có chắc chắn muốn xóa danh mục thể loại sản phẩm này không'}
            />
            <UpdateCategory
                open={openUpdateDialogCate}
                colors={colors}
                handleClose={() => setOpenUpdateDialogCate(false)}
                category={selectedCategory}
                title={'Sửa thể loại danh mục'}
                setCategory={setSelectedCategory}
                handleUpdate={handleUpdateCate}
            />
            <UpdateCategory
                open={openAddDialog}
                colors={colors}
                title={'Thêm thể loại danh mục'}
                handleClose={() => setOpenAddDialog(false)}
                setCategory={setCategory}
                category={category}
                handleUpdate={handleAddCategory}
            />
            <UpdateSubCategory
                type={0}
                open={openUpdateDialog}
                handleClose={() => setOpenUpdateDialog(false)}
                subCate={subCateToUpdate}
                title={'Cập nhập danh mục sản phẩm'}
                setSubCate={setSubCateToUpdate}
                handleUpdate={handleUpdateSubCategory}
                colors={colors}
            />
            <UpdateSubCategory
                type={1}
                open={openAddSubDialog}
                handleClose={() => setOpenAddSubDialog(false)}
                subCate={subCateToUpdate}
                title={'Thêm danh mục sản phẩm'}
                setSubCate={setSubCateToUpdate}
                handleUpdate={handleUpdateSubCategory}
                colors={colors}
            />
            {/* Cột trái - Danh mục chính */}
            <Grid item xs={4}>
                <Button variant={'contained'} sx={{background : colors.blueAccent[400],mb : 1}} onClick={()=> {
                    handleAddCate();
                }}>
                    Thêm Danh Mục Thể loại
                </Button>
                <Paper
                    sx={{
                        bgcolor: "transparent",
                        padding: 2,
                        height: "80vh",
                        borderRadius: 2,
                        overflowY: "auto",
                        "&::-webkit-scrollbar": { width: "5px" },
                        "&::-webkit-scrollbar-thumb": { bgcolor: "#888", borderRadius: "10px" },
                        "&::-webkit-scrollbar-thumb:hover": { bgcolor: "#555" },
                    }}
                >

                    {categories.map((category) => (
                        <Card
                            key={category._id}
                            sx={{
                                height: "10vh",
                                display: "flex",
                                alignItems: "center",
                                padding: 1,
                                position : 'relative',
                                justifyContent: "start",
                                marginBottom: "10px",
                                bgcolor: selectedCategory?._id === category._id ? "#1976d2" : colors.primary[400],
                                color: selectedCategory?._id === category._id ? colors.grey[900] : colors.grey[100],
                                transition: "0.3s",
                                cursor: "pointer",
                                "&:hover": { bgcolor: "#90caf9", color: "white", transform: "scale(1.02)" },
                            }}
                            onClick={() => {
                                setSelectedCategory(category);
                                setSelectedSubCate(null); // Reset danh mục con khi chọn danh mục chính mới
                            }}
                        >
                            <Typography variant="h5" fontWeight="bold">
                                {category.categoryName}
                            </Typography>
                            {selectedCategory?._id === category._id && (
                                <Box
                                    sx={{
                                        position: "absolute",
                                        bottom: 0,
                                        left: 0,
                                        width: "100%",
                                        height: "100%",
                                        display: "flex",
                                        justifyContent: "flex-end",
                                        alignItems: "center",
                                        flexDirection: "row",
                                        gap: 1,
                                        backgroundColor: "rgba(0, 0, 0, 0.5)", // Màu nền mờ
                                    }}
                                >
                                    <IconButton
                                        variant="contained"
                                        size="small"
                                        onClick={() => handlOpenMoDalCategory()}
                                    >
                                        <UpdateOutlined/>
                                    </IconButton>
                                    <IconButton
                                        variant="contained"
                                        size="small"
                                        color={'error'}
                                        onClick={() => handleDeleteClickCate()}
                                    >
                                        <DeleteOutline/>
                                    </IconButton>
                                </Box>
                            )}

                        </Card>
                    ))}
                </Paper>
            </Grid>

            {/* Cột phải - Danh mục con */}
            <Grid item xs={8}>
                <Button variant={'contained'} sx={{background : colors.blueAccent[400],mb : 1}} onClick={()=> {
                    handleAddSubCate();
                }}>
                    Thêm Danh Mục Sản Phẩm
                </Button>
                <Paper
                    sx={{
                        bgcolor: "transparent",
                        padding: 2,
                        height: "80vh",
                        borderRadius: 2,
                        overflowY: "auto",
                        "&::-webkit-scrollbar": { width: "5px" },
                        "&::-webkit-scrollbar-thumb": { bgcolor: "#888", borderRadius: "10px" },
                        "&::-webkit-scrollbar-thumb:hover": { bgcolor: "#555" },
                    }}
                >

                {selectedCategory ? (
                        <Grid container spacing={2}>
                            {subcate?.map((sub, index) => (
                                <Grid item xs={4} key={index}>
                                    <Card
                                        sx={{
                                            maxWidth: 200,
                                            textAlign: "center",
                                            borderRadius: "12px",
                                            boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                                            transition: "0.3s",
                                            position: "relative",
                                            cursor: "pointer",
                                            bgcolor: selectedSubCate?._id === sub._id ? "#1976d2" : colors.primary[400],
                                            "&:hover": {
                                                transform: "scale(1.05)",
                                                boxShadow: "0px 6px 15px rgba(0,0,0,0.2)",
                                            },
                                        }}
                                        onClick={() => setSelectedSubCate(sub)}
                                    >
                                        {/* Hình ảnh danh mục con */}
                                        <CardMedia
                                            component="img"
                                            height="160"
                                            image={sub.subImage}
                                            alt={sub.subCateName}
                                            sx={{
                                                borderRadius: "12px 12px 0 0",
                                                position: "relative",
                                            }}
                                        />

                                        {/* Hiển thị nút trong ảnh khi chọn */}
                                        {selectedSubCate?._id === sub._id && (
                                            <Box
                                                sx={{
                                                    position: "absolute",
                                                    bottom: 0,
                                                    left: 0,
                                                    width: "100%",
                                                    height: "100%",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    flexDirection: "row",
                                                    gap: 1,
                                                    backgroundColor: "rgba(0, 0, 0, 0.5)", // Màu nền mờ
                                                    borderRadius: "12px",
                                                }}
                                            >
                                                <Button
                                                    sx={{flex : 1}}
                                                    variant="contained"
                                                    color="error"
                                                    size="small"
                                                    onClick={() => handleDeleteClick(sub._id)}
                                                >
                                                    <DeleteOutline/>
                                                </Button>
                                                <Button
                                                    sx={{flex : 1}}
                                                    variant="contained"
                                                    color="primary"
                                                    size="small"
                                                    onClick={() => handleUpdateClick(sub)}
                                                >
                                                    <UpdateOutlined/>
                                                </Button>
                                            </Box>
                                        )}

                                        <CardContent sx={{ borderRadius: "0 0 12px 12px" }}>
                                            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                                                {sub.subCateName}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        <Box textAlign="center" sx={{ padding: 2, fontStyle: "italic", color: "gray" }}>
                            Chọn danh mục để xem chi tiết
                        </Box>
                    )}
                </Paper>
            </Grid>
        </Grid>
    );
};

export default CategoryList;
