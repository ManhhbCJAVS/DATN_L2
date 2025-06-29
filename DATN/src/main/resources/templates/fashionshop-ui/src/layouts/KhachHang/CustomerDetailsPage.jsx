// File này đã được thay thế bằng KhachHangChiTiet.jsx, giữ lại để tham khảo nếu cần.

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCustomerById, getCustomerAddresses, addCustomerAddress, updateCustomerAddress } from "../../apis/customer";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import Card from "@mui/material/Card";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";

const CustomerDetailsPage = () => {
  const { customerId } = useParams();
  const [customer, setCustomer] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    district: "",
    ward: "",
    status: "DEFAULT"
  });

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const customerData = await getCustomerById(customerId);
        setCustomer(customerData);
        const addressList = await getCustomerAddresses(customerId);
        setAddresses(addressList);
      } catch (e) {
        // handle error
      }
      setLoading(false);
    }
    fetchData();
  }, [customerId]);

  const handleAddAddress = async () => {
    try {
      await addCustomerAddress(customerId, newAddress);
      const addressList = await getCustomerAddresses(customerId);
      setAddresses(addressList);
      setShowAddAddress(false);
      setNewAddress({ street: "", city: "", district: "", ward: "", status: "DEFAULT" });
    } catch (e) {
      // handle error
    }
  };

  if (loading) return <SoftTypography>Đang tải...</SoftTypography>;
  if (!customer) return <SoftTypography>Không tìm thấy khách hàng</SoftTypography>;

  return (
    <SoftBox py={3}>
      <Card sx={{ p: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <Avatar src={customer.avatarUrl} sx={{ width: 120, height: 120, mb: 2 }} />
            <SoftTypography variant="h5">{customer.fullName}</SoftTypography>
            <Chip label={customer.status === "ACTIVE" ? "Đang hoạt động" : "Ngừng hoạt động"} color={customer.status === "ACTIVE" ? "success" : "default"} />
          </Grid>
          <Grid item xs={12} md={9}>
            <SoftTypography variant="h6">Thông tin cá nhân</SoftTypography>
            <Divider sx={{ my: 1 }} />
            <Grid container spacing={1}>
              <Grid item xs={12} sm={6}>
                <SoftTypography variant="body2">Số điện thoại: {customer.phoneNumber}</SoftTypography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <SoftTypography variant="body2">Giới tính: {customer.gender === "MALE" ? "Nam" : customer.gender === "FEMALE" ? "Nữ" : "Khác"}</SoftTypography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <SoftTypography variant="body2">Ngày sinh: {customer.dateOfBirth}</SoftTypography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <SoftTypography variant="body2">Email: {customer.email || "Chưa có"}</SoftTypography>
              </Grid>
            </Grid>
            <SoftTypography variant="h6" mt={3}>Địa chỉ</SoftTypography>
            <Divider sx={{ my: 1 }} />
            {addresses.length === 0 ? (
              <SoftTypography>Chưa có địa chỉ mặc định</SoftTypography>
            ) : (
              addresses.map((addr, idx) => (
                <Card key={addr.id} sx={{ mb: 1, p: 2, background: addr.status === "DEFAULT" ? "#e3f2fd" : undefined }}>
                  <SoftTypography variant="body2">
                    {addr.street}, {addr.ward}, {addr.district}, {addr.city}
                  </SoftTypography>
                  <Chip label={addr.status === "DEFAULT" ? "Mặc định" : "Phụ"} size="small" color={addr.status === "DEFAULT" ? "primary" : "default"} sx={{ mt: 1 }} />
                </Card>
              ))
            )}
            <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => setShowAddAddress(true)}>
              Thêm địa chỉ
            </Button>
          </Grid>
        </Grid>
      </Card>
      <Dialog open={showAddAddress} onClose={() => setShowAddAddress(false)}>
        <DialogTitle>Thêm địa chỉ mới</DialogTitle>
        <DialogContent>
          <TextField label="Địa chỉ" fullWidth margin="dense" value={newAddress.street} onChange={e => setNewAddress({ ...newAddress, street: e.target.value })} />
          <TextField label="Phường/Xã" fullWidth margin="dense" value={newAddress.ward} onChange={e => setNewAddress({ ...newAddress, ward: e.target.value })} />
          <TextField label="Quận/Huyện" fullWidth margin="dense" value={newAddress.district} onChange={e => setNewAddress({ ...newAddress, district: e.target.value })} />
          <TextField label="Tỉnh/Thành phố" fullWidth margin="dense" value={newAddress.city} onChange={e => setNewAddress({ ...newAddress, city: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddAddress(false)}>Hủy</Button>
          <Button onClick={handleAddAddress} variant="contained">Lưu</Button>
        </DialogActions>
      </Dialog>
    </SoftBox>
  );
};

export default CustomerDetailsPage;
