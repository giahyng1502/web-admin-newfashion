import { Box } from "@mui/material";
import VoucherTableManagement from "./VoucherTableManagement";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchVouchers } from "../../../redux/voucher/voucherSlice";

export default function Voucher() {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const { vouchers, loading, rowCount } = useSelector((state) => state.voucher);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchVouchers());
  }, [dispatch]);

  const rows = vouchers.map((voucher) => ({
    ...voucher,
    startDate: new Date(voucher.startDate).toLocaleString(),
    endDate: new Date(voucher.endDate).toLocaleString(),
  }));

  const handleRefreshVouchers = () => dispatch(fetchVouchers());

  return (
    <Box p={2}>
      <VoucherTableManagement
        rows={rows}
        isLoading={loading}
        pageSize={pageSize}
        setPageSize={setPageSize}
        page={page}
        setPage={setPage}
        rowCount={rowCount}
        onRefresh={handleRefreshVouchers}
      />
    </Box>
  );
}
