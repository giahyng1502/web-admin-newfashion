import React, {useEffect, useState} from 'react';
import {tokens} from "../../theme";
import {Box, useTheme} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {getProduct} from "../../redux/reducer/productReducer";
import ProductTable from "./product-table";
import {utilVietnamDong} from "../../utils/util-vietnam-dong";
export const productData = (data)=> {
    return data.map((item,index) => ({
        id: item._id,
        name: item.name,
        cost: item.cost,
        price: item.price,
        stock: item.stock,
        sold: item.sold,
        rateCount : item.rateCount
    }))
}
function Product(props) {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const dispatch = useDispatch();
    const {products,totalProducts} = useSelector((state) => state.product);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        setLoading(true)
        getProduct(dispatch,page,pageSize).then(response => {
            setLoading(false)
        })
    },[page,pageSize])
    return (
        <Box>
            <ProductTable
                rows={products}
                page={page}
                rowCount={totalProducts}
                isLoading={loading}
                setPage={setPage}
                setPageSize={setPageSize}
                pageSize={pageSize} />
        </Box>
    );
}

export default Product;