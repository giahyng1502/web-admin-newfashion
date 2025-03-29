import {Box, Button, IconButton, Paper, Typography, useTheme} from "@mui/material";
import {tokens} from "../../theme";
import {useDispatch} from "react-redux";
import {useNotification} from "../../snackbar/NotificationContext";
import React, {useState} from "react";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import {utilVietnamDong} from "../../utils/util-vietnam-dong";
import ProductDialog from "../../dialogs/show-product";
import {DataGrid} from "@mui/x-data-grid";
import {updateProduct} from "../../redux/reducer/productReducer";
import {exportToExcel} from "../../utils/export-excel";
import axios from "../../apis/axios";
import AddSaleProduct from "../../dialogs/add-saleProduct";

export default function ProductTable({
                                         isLoading, rows, setRows,
                                         pageSize, setPageSize,
                                         page, setPage,
                                         rowCount, handleOpenAddUser
                                     }) {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const dispatch = useDispatch();
    const showNotification = useNotification();
    const [isShowProduct, setIsShowProduct] = useState(false);
    const [isSaleProductDialog, setIsSaleProductDialog] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [saleProductSelected, setSaleProductSelected] = useState({

    });

    const handleOpenDialog = async (product) => {
        try {
            const res = await axios.get(`/getone/${product.id}`);
            setSelectedProduct(res.data.data);
            setIsShowProduct(true);
        } catch (error) {
            showNotification("Không thể tải sản phẩm", "error");
        }
    };

    const handleOpenSaleProductDialog = async (product) => {
        console.log(product);
        setSaleProductSelected(product)
        setIsSaleProductDialog(true);
    }

    const handleRowUpdate = async (newRow, oldRow) => {
        try {
            const changedFields = Object.keys(newRow).filter(
                (key) => newRow[key] !== oldRow[key]
            );

            if (changedFields.length === 0) {
                showNotification("Không có dữ liệu nào thay đổi", "error");
                return oldRow;
            }

            const updatedData = changedFields.reduce((acc, key) => {
                acc[key] = newRow[key];
                return acc;
            }, {});

            const res = await axios.put(`/updateProduct/${newRow.id}`, updatedData);
            if (res.status === 200) {
                const data = res.data.product;
                const valueDate = {
                    id: data._id,
                    name: data.name,
                    cost: data.cost,
                    price: data.price,
                    stock: data.stock,
                    sold: data.sold,
                    rateCount: data.rateCount,
                };
                dispatch(updateProduct(valueDate));
                showNotification("Cập nhật sản phẩm thành công", "success");
                return valueDate;
            }
        } catch (error) {
            showNotification("Lỗi khi cập nhật sản phẩm", "error");
        }
        return oldRow;
    };
    const addSaleProduct = async (product)=> {
        try {
            const res = await axios.post(`saleProduct/add`, product);
            if (res.status === 201) {
                showNotification('Sản phẩm này đã được thêm vào danh sách giảm giá', 'success');
            }
            else {
                showNotification('Sản phẩm này đã có trong danh sách hàng giảm giá', 'error')
            }
            setIsSaleProductDialog(false)
        }catch (e) {
            showNotification('Lỗi khi thêm thêm sản phẩm giảm giá', 'error');
            console.log(e)
        }
    }
    const getColumns = () => [
        { field: "id", headerName: "ID", width: 80, align: "center", headerAlign: "center", hide: true },
        { field: "name", headerName: "Tên sản phẩm", width: 380, editable: true, align: "center", headerAlign: "center",
            renderCell: (params) => (
                <Box sx={{
                    whiteSpace: "pre-wrap",
                    wordWrap: "break-word",
                    p: 1,
                    display: "flex",
                    height: "100%",
                    width: "100%"
                }}>
                    <Typography>{params.value}</Typography>
                </Box>
            )
        },
        { field: "cost", headerName: "Giá nhập kho", editable: true, width: 120, align: "center", headerAlign: "center",
            renderCell: (params) => (
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", width: "100%" }}>
                    <Typography>{utilVietnamDong(params.value)}</Typography>
                </Box>
            )
        },
        { field: "price", headerName: "Giá bán ra", width: 100, editable: true, align: "center", headerAlign: "center",
            renderCell: (params) => (
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", width: "100%" }}>
                    <Typography>{utilVietnamDong(params.value)}</Typography>
                </Box>
            )
        },
        { field: "stock", headerName: "Hàng tồn kho", width: 100, editable: true, align: "center", headerAlign: "center",
            renderCell: (params) => (
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", width: "100%" }}>
                    <Typography>{params.value}</Typography>
                </Box>
            )
        },
        { field: "sold", headerName: "Lượt mua", width: 100, align: "center", headerAlign: "center",
            renderCell: (params) => (
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", width: "100%" }}>
                    <Typography>{params.value}</Typography>
                </Box>
            )
        },
        { field: "rateCount", headerName: "Đánh giá", width: 100, align: "center", headerAlign: "center",
            renderCell: (params) => (
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", width: "100%" }}>
                    <Typography>{params.value}</Typography>
                </Box>
            )
        },
        {
            field: "action",
            headerName: "Hành động",
            width: 150,
            align: "center",
            headerAlign: "center",
            renderCell: (params) => (
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", width: "100%" }}>
                    <IconButton onClick={() => handleOpenDialog(params.row)}>
                        <RemoveRedEyeIcon />
                    </IconButton>
                    <IconButton onClick={() => handleOpenSaleProductDialog(params.row)}>
                        <RemoveRedEyeIcon />
                    </IconButton>
                </Box>
            )
        }
    ];



    return (
        <>
            <AddSaleProduct product={saleProductSelected} onClose={()=>{setIsSaleProductDialog(false)}} open={isSaleProductDialog} addSaleProduct={addSaleProduct} />
            <ProductDialog dispatch={dispatch} showNotification={showNotification} colors={colors} open={isShowProduct} onClose={() => setIsShowProduct(false)} product={selectedProduct} />
            <Paper
                sx={{
                    height: "550px",
                    width: "96%",
                    maxWidth: "1200px",
                    padding: 4,
                    overflow: "auto",
                    backgroundColor: colors.primary[400],
                    margin: "auto",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                }}
            >
                <Box display="flex" justifyContent="space-between" width="100%">
                    <Button variant="contained" color="primary" onClick={handleOpenAddUser} sx={{ marginBottom: 2 }}>
                        Thêm sản phẩm
                    </Button>
                    <Button variant="contained" color="primary" onClick={() => exportToExcel(rows)} sx={{ marginBottom: 2 }}>
                        Xuất Excel
                    </Button>
                </Box>
                <DataGrid
                    rows={rows}
                    hideFooterSelectedRowCount={true}
                    loading={isLoading}
                    rowCount={rowCount}
                    columnVisibilityModel={{
                        id: false, // Ẩn cột "id"
                    }}
                    pageSizeOptions={[5, 10, 20, 50, 100]}
                    paginationModel={{ page, pageSize }}
                    paginationMode="server"
                    getRowHeight={() => "auto"}
                    onPaginationModelChange={(model) => {
                        setPage(model.page);
                        setPageSize(model.pageSize);
                    }}
                    sx={{ width: "100%" }}
                    columns={getColumns()}
                    processRowUpdate={handleRowUpdate}
                />
            </Paper>
        </>
    );
}