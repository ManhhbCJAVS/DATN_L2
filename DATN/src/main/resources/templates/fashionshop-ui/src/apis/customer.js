import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080", // Đổi đúng port BE nếu khác
});

// Lấy chi tiết khách hàng theo ID
export const getCustomerById = async (customerId) => {
  try {
    const response = await api.get(`/admin/customer/${customerId}`);
    if (response.data.status === 200) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Không lấy được dữ liệu khách hàng");
  } catch (error) {
    throw error;
  }
};

// Lấy danh sách địa chỉ của khách hàng
export const getCustomerAddresses = async (customerId) => {
  try {
    const response = await api.get(`/admin/customer/${customerId}/addresses`);
    if (response.data.status === 200) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Không lấy được địa chỉ khách hàng");
  } catch (error) {
    throw error;
  }
};

// Thêm địa chỉ mới cho khách hàng
export const addCustomerAddress = async (customerId, addressData) => {
  try {
    const response = await api.post(`/admin/customer/${customerId}/addresses`, addressData);
    if (response.data.status === 200) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Không thêm được địa chỉ");
  } catch (error) {
    throw error;
  }
};

// Cập nhật địa chỉ cho khách hàng
export const updateCustomerAddress = async (customerId, addressId, addressData) => {
  try {
    const response = await api.put(`/admin/customer/${customerId}/addresses/${addressId}`, addressData);
    if (response.data.status === 200) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Không cập nhật được địa chỉ");
  } catch (error) {
    throw error;
  }
};
