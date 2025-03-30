import React, { useEffect, useState } from "react";
import { tokens } from "../../theme";
import { Box, useTheme, TextField, MenuItem, Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getProduct } from "../../redux/reducer/productReducer";
import ProductTable from "./product-table";
import {getData} from "../../redux/reducer/userReducer";

export const productData = (data) => {
    return data.map((item, index) => ({
        id: item._id,
        name: item.name,
        cost: item.cost,
        price: item.price,
        stock: item.stock,
        sold: item.sold,
        rating: item.rating,
    }));
};

function Product(props) {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const dispatch = useDispatch();
    const { products, totalProducts } = useSelector((state) => state.product);

    // State cho phân trang, tìm kiếm, sắp xếp
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [sortModel, setSortModel] = useState([{ field: "createdAt", sort: "desc" }]);


    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            const sortField = sortModel.length > 0 ? sortModel[0].field : "createdAt";
            const sortOrder = sortModel.length > 0 ? sortModel[0].sort : "desc";
            console.log(sortModel);
            await getProduct(dispatch, page, pageSize,search,minPrice,maxPrice, sortField, sortOrder);
            setLoading(false);
        };

        fetchProduct();
    }, [dispatch, page, pageSize, search,minPrice, maxPrice, sortModel]);



    return (
        <Box>
            {/* Bảng hiển thị sản phẩm */}
            <ProductTable
                rows={products}
                page={page}
                setSearch={setSearch}
                sortModel={sortModel}
                setSortModel={setSortModel}
                rowCount={totalProducts}
                isLoading={loading}
                setPage={setPage}
                setPageSize={setPageSize}
                pageSize={pageSize}
            />
        </Box>
    );
}

export default Product;
