import axios from "../apis/axios";

const API_URL = "/voucher";

const voucherAPI = {
  getAll: async () => {
    const response = await axios.get(`${API_URL}/getAllVoucher`);
    return response.data;
  },

  createVoucher: async (voucherData) => {
    const response = await axios.post(`${API_URL}/create`, voucherData);
    return response.data;
  },

  updateVoucher: async ({ voucherId, voucherData }) => {
    const response = await axios.put(
      `${API_URL}/update/${voucherId}`,
      voucherData
    );
    return response.data;
  },

  removeVoucher: async (voucherId) => {
    const response = await axios.delete(`${API_URL}/delete/${voucherId}`);
    return response.data;
  },
};

export default voucherAPI;
