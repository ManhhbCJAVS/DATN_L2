import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import SoftBox from "components/SoftBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import CircularProgress from "@mui/material/CircularProgress";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { getCustomerById } from "../../apis/customer";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import Select from "@mui/material/Select";

function CapNhatKhachHang() {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    customerName: "",
    phoneNumber: "",
    email: "",
    birthDate: "",
    gender: "MALE"
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    setLoading(true);
    getCustomerById(customerId)
      .then((customer) => {
        setData(customer);
        setForm({
          customerName: customer.customerName || '',
          phoneNumber: customer.phoneNumber || '',
          email: customer.email || '',
          birthDate: customer.birthDate || '',
          gender: customer.gender || 'MALE',
        });
        setImagePreview(customer.imageResponse?.imageUrl || null);
      })
      .catch(() => setError("Không thể tải dữ liệu khách hàng"))
      .finally(() => setLoading(false));
  }, [customerId]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.customerName.trim() || !form.phoneNumber.trim() || !form.email.trim()) {
      setSnackbar({ open: true, message: 'Vui lòng nhập đầy đủ thông tin!', severity: 'error' });
      return;
    }
    try {
      const updateData = {
        id: customerId,
        customerName: form.customerName,
        phoneNumber: form.phoneNumber,
        email: form.email,
        birthDate: form.birthDate,
        gender: form.gender,
        status: data.status
      };
      const formData = new FormData();
      formData.append(
        "CustomerUpdateRequest",
        new Blob([JSON.stringify(updateData)], { type: "application/json" })
      );
      const response = await fetch(`http://localhost:8080/admin/customer/${customerId}`, {
        method: "PATCH",
        body: formData
      });
      if (response.ok) {
        setSnackbar({ open: true, message: 'Cập nhật thành công!', severity: 'success' });
        setTimeout(() => navigate(-1), 1200);
      } else {
        setSnackbar({ open: true, message: 'Lỗi cập nhật!', severity: 'error' });
      }
    } catch (err) {
      setSnackbar({ open: true, message: 'Lỗi mạng!', severity: 'error' });
    }
  };

  if (loading) return <SoftBox display="flex" justifyContent="center" alignItems="center" minHeight="60vh"><CircularProgress /></SoftBox>;
  if (error) return <SoftBox color="error.main" textAlign="center">{error}</SoftBox>;
  if (!data) return null;

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3} sx={{ background: "#f6f7fb", minHeight: "100vh", fontFamily: 'Roboto, Helvetica, Arial, sans-serif', px: 0 }}>
        <SoftBox width="100%" maxWidth="100%" px={0}>
          <Card sx={{ borderRadius: 4, boxShadow: 2, p: { xs: 2, md: 5 }, background: '#fff', width: '100%', minHeight: 650, display: 'block', mx: 0, px: 4 }}>
            <h2 style={{ fontWeight: 700, color: '#384D6C', margin: '32px 0 24px 0', fontSize: 30, textAlign: 'left' }}>Cập Nhật Khách Hàng</h2>
            <form onSubmit={handleSubmit} autoComplete="off">
              <Grid container spacing={4} alignItems="flex-start" sx={{ width: '100%' }}>
                <Grid item xs={12} md={4} display="flex" flexDirection="column" alignItems="center" justifyContent="center" sx={{ mt: 2 }}>
                  {imagePreview ? (
                    <img src={imagePreview} alt="avatar" style={{ width: 180, height: 180, borderRadius: "50%", objectFit: "cover", border: "2px solid #49a3f1", marginBottom: 8, background: '#e3f0fc' }} />
                  ) : (
                    <div style={{ width: 180, height: 180, borderRadius: '50%', background: '#e3e3e3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64, fontWeight: 700, color: '#384D6C', border: '2px solid #49a3f1', marginBottom: 8 }}>
                      {form.customerName?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  )}
                  {imageFile && (
                    <span style={{ fontSize: 13, color: '#888', marginTop: 8 }}>{imageFile.name}</span>
                  )}
                  <label htmlFor="upload-avatar">
                    <input accept="image/*" id="upload-avatar" type="file" style={{ display: 'none' }} onChange={handleImageChange} />
                    <Button variant="outlined" component="span" startIcon={<PhotoCamera />} sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 500 }}>
                      Chọn ảnh
                    </Button>
                  </label>
                </Grid>
                <Grid item xs={12} md={8} display="flex" flexDirection="column" justifyContent="center" sx={{ width: '100%' }}>
                  <Grid container spacing={3} sx={{ width: '100%' }}>
                    <Grid item xs={12} sm={6}>
                      <TextField label="Họ tên khách hàng" name="customerName" value={form.customerName} onChange={handleChange} fullWidth size="medium" InputLabelProps={{ shrink: true, style: { top: 0, fontSize: 16, background: '#fff', padding: '0 4px' } }} sx={{ mb: 2, minWidth: 320 }} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField label="Email" name="email" value={form.email} onChange={handleChange} fullWidth size="medium" InputLabelProps={{ shrink: true, style: { top: 0, fontSize: 16, background: '#fff', padding: '0 4px' } }} sx={{ mb: 2, minWidth: 320 }} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField label="Số điện thoại" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} fullWidth size="medium" InputLabelProps={{ shrink: true, style: { top: 0, fontSize: 16, background: '#fff', padding: '0 4px' } }} sx={{ mb: 2, minWidth: 320 }} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField label="Ngày sinh" name="birthDate" type="date" value={form.birthDate} onChange={handleChange} fullWidth size="medium" InputLabelProps={{ shrink: true, style: { top: 0, fontSize: 16, background: '#fff', padding: '0 4px' } }} sx={{ mb: 2, minWidth: 320 }} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField select label="Giới tính" name="gender" value={form.gender} onChange={handleChange} fullWidth size="medium" InputLabelProps={{ shrink: true, style: { top: 0, fontSize: 16, background: '#fff', padding: '0 4px' } }} sx={{ mb: 2, minWidth: 320 }} SelectProps={{ native: true }}>
                        <option value="MALE">Nam</option>
                        <option value="FEMALE">Nữ</option>
                      </TextField>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <SoftBox mt={4} display="flex" justifyContent="flex-end" gap={2}>
                <Button variant="outlined" color="secondary" onClick={() => navigate(-1)}>Hủy</Button>
                <Button type="submit" variant="contained" color="primary">Lưu thay đổi</Button>
              </SoftBox>
            </form>
          </Card>
        </SoftBox>
      </SoftBox>
      <Snackbar open={snackbar.open} autoHideDuration={2500} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <MuiAlert elevation={6} variant="filled" onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ fontSize: 16 }}>
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
      <Footer />
    </DashboardLayout>
  );
}

export default CapNhatKhachHang;
