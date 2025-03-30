import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import voucherAPI from "../../services/voucherAPI";

const initialState = {
  vouchers: [],
  rowCount: 0,
  loading: false,
  error: null,
};

// Fetch tất cả voucher
export const fetchVouchers = createAsyncThunk(
  "voucher/fetchVouchers",
  async (_, { rejectWithValue }) => {
    try {
      const data = await voucherAPI.getAll();
      return data.data; // Trả về mảng voucher
    } catch (error) {
      return rejectWithValue(error.response?.data || "Lỗi không xác định");
    }
  }
);

// Tạo voucher mới
export const createVoucher = createAsyncThunk(
  "voucher/createVoucher",
  async (voucherData, { rejectWithValue }) => {
    try {
      const data = await voucherAPI.createVoucher(voucherData);
      return data.data; // Trả về voucher vừa tạo
    } catch (error) {
      return rejectWithValue(error.response?.data || "Lỗi không xác định");
    }
  }
);

// Cập nhật voucher
export const updateVoucher = createAsyncThunk(
  "voucher/updateVoucher",
  async ({ voucherId, voucherData }, { rejectWithValue }) => {
    try {
      const data = await voucherAPI.updateVoucher({ voucherId, voucherData });
      return data.data; // Trả về voucher sau khi cập nhật
    } catch (error) {
      return rejectWithValue(error.response?.data || "Lỗi không xác định");
    }
  }
);

// Xóa voucher
export const removeVoucher = createAsyncThunk(
  "voucher/removeVoucher",
  async (voucherId, { rejectWithValue }) => {
    try {
      const data = await voucherAPI.removeVoucher(voucherId);
      return voucherId; // Trả về ID của voucher vừa xóa
    } catch (error) {
      return rejectWithValue(error.response?.data || "Lỗi không xác định");
    }
  }
);

const voucherSlice = createSlice({
  name: "voucher",
  initialState,
  extraReducers: (builder) => {
    builder
      // Lấy danh sách voucher
      .addCase(fetchVouchers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVouchers.fulfilled, (state, action) => {
        state.loading = false;
        state.vouchers = action.payload;
        state.rowCount = action.payload.length;
      })
      .addCase(fetchVouchers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Thêm voucher mới
      .addCase(createVoucher.fulfilled, (state, action) => {
        state.vouchers.push(action.payload);
        state.rowCount += 1;
      })
      .addCase(createVoucher.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Cập nhật voucher
      .addCase(updateVoucher.fulfilled, (state, action) => {
        const index = state.vouchers.findIndex(
          (v) => v._id === action.payload._id
        );
        if (index !== -1) {
          state.vouchers[index] = action.payload;
        }
      })
      .addCase(updateVoucher.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Xóa voucher
      .addCase(removeVoucher.fulfilled, (state, action) => {
        state.vouchers = state.vouchers.filter((v) => v._id !== action.payload);
        state.rowCount -= 1;
      })
      .addCase(removeVoucher.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default voucherSlice.reducer;
