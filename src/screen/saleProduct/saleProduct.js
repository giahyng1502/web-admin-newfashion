import React, {useEffect, useState} from 'react';
import {Box, useTheme} from "@mui/material";
import TableSaleProduct from "./table-saleProduct";
import axios from "../../apis/axios";
import {utilDatetime} from "../../utils/util-datetime";
export const productData = (data)=> {
    return data.map((item,index) => ({
        id: item._id,
        productId: item.productId._id,
        name: item.productId.name,
        discount: item.discount,
        price: item.productId.price,
        priceSale : item.productId.price-((item.discount/100) * item.productId.price),
        limit: item.limit,
        expireAt : utilDatetime(item.expireAt),
    }))
}
function SaleProduct(props) {
    const [saleProduct, setSaleProduct] = useState([])
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [totalSaleProduct, setTotalSaleProduct] = useState(0)
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        setLoading(true)
        getSaleProduct().then(res => {
            setSaleProduct(productData(res.data))
            setTotalSaleProduct(res.totalSaleProducts)
        })
        setLoading(false)

    },[page,pageSize])
    const getSaleProduct = async () => {
        try {
            const res = await axios.get('saleProduct/all')
            if (res.status === 200) {
                return res.data
            }
            return []
        }catch(error) {
            console.log(error);
        }
    }
    return (
        <Box>
            <TableSaleProduct
                rows={saleProduct}
                page={page}
                rowCount={totalSaleProduct}
                isLoading={loading}
                setPage={setPage}
                setPageSize={setPageSize}
                pageSize={pageSize} />
        </Box>
    );
}

export default SaleProduct;