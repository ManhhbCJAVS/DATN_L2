import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import SoftBox from "components/SoftBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import Select from "@mui/material/Select";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Snackbar from "@mui/material/Snackbar";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';

const defaultData = {
  employeeName: "",
  citizenId: "",
  email: "",
  birthDate: "",
  gender: "MALE",
  phoneNumber: "",
  role: "EMPLOYEE",
  status: "ACTIVE",
  address: { city: "", district: "", ward: "", street: "" },
};

function CapNhatNhanVien() {
  const { id } = useParams();
  const [data, setData] = useState(defaultData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [openError, setOpenError] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openCancel, setOpenCancel] = useState(false);
  const [pendingSubmit, setPendingSubmit] = useState(false);
  const navigate = useNavigate();

  // Fetch employee data
  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:8080/admin/employee/${id}`)
      .then(res => {
        const emp = res.data.data;
        setData({
          ...emp,
          address: emp.addressResponse || defaultData.address,
        });
        setImagePreview(emp.imageResponse?.imageUrl || null);
      })
      .catch(() => setError("Không thể tải dữ liệu nhân viên"))
      .finally(() => setLoading(false));
  }, [id]);

  // Fetch cities on mount
  useEffect(() => {
    let ignore = false;
    setCities([]);
    axios.get('https://provinces.open-api.vn/api/p/')
      .then(res => { if (!ignore) setCities(res.data); })
      .catch(() => { if (!ignore) setCities([]); });
    return () => { ignore = true; };
  }, []);

  // Fetch districts when city changes
  useEffect(() => {
    if (data.address.city) {
      const selectedCity = cities.find(c => c.name === data.address.city);
      if (selectedCity) {
        axios.get(`https://provinces.open-api.vn/api/p/${selectedCity.code}?depth=2`)
          .then(res => setDistricts(res.data.districts))
          .catch(() => setDistricts([]));
      }
    } else {
      setDistricts([]); setWards([]);
    }
  }, [data.address.city, cities]);

  // Fetch wards when district changes
  useEffect(() => {
    if (data.address.district) {
      const selectedDistrict = districts.find(d => d.name === data.address.district);
      if (selectedDistrict) {
        axios.get(`https://provinces.open-api.vn/api/d/${selectedDistrict.code}?depth=2`)
          .then(res => setWards(res.data.wards))
          .catch(() => setWards([]));
      }
    } else {
      setWards([]);
    }
  }, [data.address.district, districts]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };
  // Đảm bảo reset dữ liệu cấp dưới khi chọn lại cấp trên
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    if (name === 'city') {
      setDistricts([]);
      setWards([]);
      setData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          city: value,
          district: '',
          ward: '',
        }
      }));
      return;
    }
    if (name === 'district') {
      setWards([]);
      setData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          district: value,
          ward: '',
        }
      }));
      return;
    }
    setData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value
      }
    }));
  };
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Validate form (ảnh không bắt buộc)
  const validateForm = () => {
    if (!data.employeeName || !data.employeeName.trim()) return "Vui lòng nhập họ và tên.";
    if (!data.email || !data.email.trim()) return "Vui lòng nhập email.";
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (data.email && !emailRegex.test(data.email)) return "Email không đúng định dạng.";
    if (!data.citizenId || !data.citizenId.trim()) return "Vui lòng nhập CCCD.";
    if (!/^\d{12}$/.test(data.citizenId)) return "CCCD phải gồm đúng 12 số, không chứa ký tự khác hoặc khoảng trắng.";
    if (!data.phoneNumber || !data.phoneNumber.trim()) return "Vui lòng nhập số điện thoại.";
    // Validate phone: 10 số, bắt đầu bằng 03, 05, 07, 08, 09
    if (!/^(03|05|07|08|09)[0-9]{8}$/.test(data.phoneNumber)) return "Số điện thoại phải có đúng 10 số và bắt đầu bằng 03, 05, 07, 08, hoặc 09.";
    if (!data.birthDate) return "Vui lòng chọn ngày sinh.";
    // Validate >= 18 tuổi
    const today = new Date();
    const birth = new Date(data.birthDate);
    if (today.getFullYear() - birth.getFullYear() < 18 || (today.getFullYear() - birth.getFullYear() === 18 && today < new Date(birth.getFullYear() + 18, birth.getMonth(), birth.getDate()))) {
      return "Nhân viên phải đủ 18 tuổi trở lên.";
    }
    if (!data.address.city) return "Vui lòng chọn tỉnh/thành phố.";
    if (!data.address.district) return "Vui lòng chọn quận/huyện.";
    if (!data.address.ward) return "Vui lòng chọn xã/phường.";
    if (!data.address.street || !data.address.street.trim()) return "Vui lòng nhập số nhà/ngõ/đường.";
    // Ảnh đại diện: chỉ bắt buộc nếu chưa có ảnh cũ và chưa chọn ảnh mới
    if (!imageFile && !imagePreview) return "Vui lòng chọn ảnh đại diện.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPendingSubmit(true);
    setOpenConfirm(true);
  };

  const handleConfirm = async () => {
    setOpenConfirm(false);
    setLoading(true); setError(""); setSuccess("");
    const errMsg = validateForm();
    if (errMsg) {
      setError(errMsg);
      setOpenError(true);
      setLoading(false);
      setPendingSubmit(false);
      return;
    }
    try {
      const formData = new FormData();
      // Đảm bảo có id trong object gửi lên
      const updateData = { ...data, id: Number(id) };
      formData.append('employee', new Blob([JSON.stringify(updateData)], { type: 'application/json' }));
      if (imageFile) formData.append('imageFile', imageFile);
      const res = await axios.patch(`http://localhost:8080/admin/employee/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      if (res.data.status === 200) {
        setSuccess("Cập nhật nhân viên thành công!");
        setTimeout(() => navigate("/NhanVien"), 1200);
      } else {
        setError(res.data.message || "Có lỗi xảy ra khi cập nhật nhân viên.");
        setOpenError(true);
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi cập nhật nhân viên.");
      setOpenError(true);
    } finally {
      setLoading(false);
      setPendingSubmit(false);
    }
  };

  const handleCancel = () => {
    setOpenCancel(true);
  };
  const handleCancelConfirm = () => {
    setOpenCancel(false);
    navigate("/NhanVien");
  };
  const handleCancelClose = () => {
    setOpenCancel(false);
  };

  // Tính ngày tối đa cho ngày sinh (phải đủ 18 tuổi)
  const today = new Date();
  const maxBirthDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
  const maxBirthDateStr = maxBirthDate.toISOString().split('T')[0];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={5} sx={{ background: "#f6f7fb", minHeight: "100vh", width: '100%', px: 0 }}>
        <SoftBox width="100%" maxWidth="100%" px={0}>
          <Card sx={{ borderRadius: 4, boxShadow: 2, p: { xs: 2, md: 5 }, background: '#fff', width: '100%', minHeight: 650, display: 'block', mx: 0, px: 4 }}>
            <h2 style={{ fontWeight: 700, color: '#384D6C', margin: '32px 0 24px 0', fontSize: 30, textAlign: 'left' }}>Cập Nhật Nhân Viên</h2>
            {/* Snackbar lỗi hiển thị góc phải, dưới DashboardNavbar */}
            <Snackbar
              open={openError}
              autoHideDuration={3000}
              onClose={() => setOpenError(false)}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              message={error}
              ContentProps={{ sx: { bgcolor: '#f44336', color: '#fff', fontWeight: 600, fontSize: 16, px: 3, py: 1.5, borderRadius: 2 } }}
              sx={{ mt: { xs: 7, md: 8 } }}
            />
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
            <form onSubmit={handleSubmit} autoComplete="off">
              <Grid container spacing={4} alignItems="flex-start" sx={{ width: '100%' }}>
                <Grid item xs={12} md={4} display="flex" flexDirection="column" alignItems="center" justifyContent="center" sx={{ mt: 2 }}>
                  {imagePreview ? (
                    <img src={imagePreview} alt="avatar" style={{ width: 180, height: 180, borderRadius: "50%", objectFit: "cover", border: "2px solid #49a3f1", marginBottom: 8, background: '#e3f0fc' }} />
                  ) : (
                    <div style={{
                      width: 180,
                      height: 180,
                      borderRadius: '50%',
                      background: '#e3e3e3',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 64,
                      fontWeight: 700,
                      color: '#384D6C',
                      border: '2px solid #49a3f1',
                      marginBottom: 8
                    }}>
                      {data.employeeName?.charAt(0)?.toUpperCase() || 'U'}
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
                      <TextField label="Họ và tên" name="employeeName" value={data.employeeName} onChange={handleChange} fullWidth size="medium" InputLabelProps={{ shrink: true, style: { top: 0, fontSize: 16, background: '#fff', padding: '0 4px' } }} sx={{ mb: 2, minWidth: 320 }} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField label="Email" name="email" value={data.email} onChange={handleChange} fullWidth size="medium" InputLabelProps={{ shrink: true, style: { top: 0, fontSize: 16, background: '#fff', padding: '0 4px' } }} sx={{ mb: 2, minWidth: 320 }} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField label="CCCD" name="citizenId" value={data.citizenId} onChange={handleChange} fullWidth size="medium" inputProps={{ maxLength: 12 }} InputLabelProps={{ shrink: true, style: { top: 0, fontSize: 16, background: '#fff', padding: '0 4px' } }} sx={{ mb: 2, minWidth: 320 }} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField label="Số điện thoại" name="phoneNumber" value={data.phoneNumber} onChange={handleChange} fullWidth size="medium" inputProps={{ maxLength: 10 }} InputLabelProps={{ shrink: true, style: { top: 0, fontSize: 16, background: '#fff', padding: '0 4px' } }} sx={{ mb: 2, minWidth: 320 }} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Ngày sinh"
                        name="birthDate"
                        value={data.birthDate}
                        onChange={handleChange}
                        fullWidth
                        size="medium"
                        type="date"
                        InputLabelProps={{ shrink: true, style: { top: 0, fontSize: 16, background: '#fff', padding: '0 4px' } }}
                        sx={{ mb: 2, minWidth: 320 }}
                        inputProps={{ max: maxBirthDateStr }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        select
                        label="Trạng thái"
                        name="status"
                        value={data.status || "ACTIVE"}
                        onChange={handleChange}
                        fullWidth
                        size="medium"
                        InputLabelProps={{ shrink: true, style: { top: 0, fontSize: 16, background: '#fff', padding: '0 4px' } }}
                        sx={{ mb: 2, minWidth: 320 }}
                      >
                        <MenuItem value="ACTIVE">Đang làm</MenuItem>
                        <MenuItem value="INACTIVE">Nghỉ việc</MenuItem>
                      </TextField>
                    </Grid>
                    {/* Giới tính và Chức vụ hiển thị đẹp, cùng hàng, spacing hợp lý */}
                    <Grid item xs={12} sm={12} md={12} display="flex" flexDirection={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} gap={4}>
                      <FormControl component="fieldset" sx={{ minWidth: 220, mb: { xs: 2, sm: 0 } }}>
                        <FormLabel component="legend" sx={{ fontSize: 16, mb: 1 }}>Giới tính</FormLabel>
                        <RadioGroup row name="gender" value={data.gender} onChange={handleChange}>
                          <FormControlLabel value="MALE" control={<Radio />} label="Nam" />
                          <FormControlLabel value="FEMALE" control={<Radio />} label="Nữ" />
                        </RadioGroup>
                      </FormControl>
                      <FormControl component="fieldset" sx={{ minWidth: 220 }}>
                        <FormLabel component="legend" sx={{ fontSize: 16, mb: 1 }}>Chức vụ</FormLabel>
                        <RadioGroup row name="role" value={data.role} onChange={handleChange}>
                          <FormControlLabel value="EMPLOYEE" control={<Radio />} label="Nhân viên" />
                          <FormControlLabel value="ADMIN" control={<Radio />} label="Quản lý" />
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Card sx={{ p: 3, mt: 3, borderRadius: 3, background: '#fafbfc', boxShadow: 0, overflow: 'visible' }}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6} md={3}>
                        <Select
                          label="Tỉnh/Thành phố"
                          name="city"
                          value={data.address.city}
                          onChange={handleAddressChange}
                          fullWidth
                          size="medium"
                          displayEmpty
                          disabled={cities.length === 0}
                          inputProps={{ 'aria-label': 'Tỉnh/Thành phố' }}
                          sx={{ background: '#fff' }}
                        >
                          <MenuItem value="">{cities.length === 0 ? 'Đang tải...' : 'Chọn tỉnh/thành phố'}</MenuItem>
                          {cities.map((c) => (
                            <MenuItem key={c.code} value={c.name}>{c.name}</MenuItem>
                          ))}
                        </Select>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Select
                          label="Quận/Huyện"
                          name="district"
                          value={data.address.district}
                          onChange={handleAddressChange}
                          fullWidth
                          size="medium"
                          displayEmpty
                          disabled={!data.address.city}
                          inputProps={{ 'aria-label': 'Quận/Huyện' }}
                          sx={{ background: '#fff' }}
                        >
                          <MenuItem value="">Chọn quận/huyện</MenuItem>
                          {districts.map((d) => (
                            <MenuItem key={d.code} value={d.name}>{d.name}</MenuItem>
                          ))}
                        </Select>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Select
                          label="Xã/Phường"
                          name="ward"
                          value={data.address.ward}
                          onChange={handleAddressChange}
                          fullWidth
                          size="medium"
                          displayEmpty
                          disabled={!data.address.district}
                          inputProps={{ 'aria-label': 'Xã/Phường' }}
                          sx={{ background: '#fff' }}
                        >
                          <MenuItem value="">Chọn xã/phường</MenuItem>
                          {wards.map((w) => (
                            <MenuItem key={w.code} value={w.name}>{w.name}</MenuItem>
                          ))}
                        </Select>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <TextField label="Số nhà/Ngõ/Đường" name="street" value={data.address.street} onChange={handleAddressChange} fullWidth size="medium" InputLabelProps={{ shrink: true, style: { top: 0, fontSize: 16, background: '#fff', padding: '0 4px' } }} />
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
              </Grid>
              <SoftBox mt={4} display="flex" justifyContent="flex-end" gap={2}>
                <Button variant="outlined" color="error" sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 500, borderColor: '#e53935', color: '#e53935', '&:hover': { background: '#ffebee', borderColor: '#e53935', color: '#b71c1c' } }} onClick={handleCancel}>Huỷ</Button>
                <Button type="submit" variant="contained" color="info" disabled={loading} sx={{ minWidth: 180, fontWeight: 600, fontSize: 16 }}>
                  {loading ? <CircularProgress size={22} /> : "Cập nhật nhân viên"}
                </Button>
              </SoftBox>
            </form>
            <Dialog open={openConfirm} onClose={handleCancel}>
              <DialogTitle>Xác nhận cập nhật nhân viên</DialogTitle>
              <DialogContent>
                <DialogContentText>Bạn có chắc chắn muốn cập nhật thông tin nhân viên này?</DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCancel} color="error">Hủy</Button>
                <Button onClick={handleConfirm} color="info" variant="contained" autoFocus>Xác nhận</Button>
              </DialogActions>
            </Dialog>
            <Dialog open={openCancel} onClose={handleCancelClose}>
              <DialogTitle>Xác nhận huỷ</DialogTitle>
              <DialogContent>
                <DialogContentText>Bạn có chắc chắn muốn huỷ và quay về danh sách nhân viên? Mọi thay đổi sẽ không được lưu.</DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCancelClose} color="info">Không</Button>
                <Button onClick={handleCancelConfirm} color="error" variant="contained" autoFocus>Đồng ý</Button>
              </DialogActions>
            </Dialog>
          </Card>
        </SoftBox>
      </SoftBox>
      <Footer />
    </DashboardLayout>  
  );        
}

export default CapNhatNhanVien;
