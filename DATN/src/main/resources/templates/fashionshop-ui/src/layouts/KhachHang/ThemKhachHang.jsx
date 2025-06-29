import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import SoftBox from "components/SoftBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Icon from "@mui/material/Icon";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import dayjs from "dayjs";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Select from "@mui/material/Select";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';

const MAX_ADDRESSES = 3;

function ThemKhachHang() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        customerName: "",
        email: "",
        phoneNumber: "",
        birthDate: "",
        gender: "MALE",
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [cities, setCities] = useState([]);
    const [districtsList, setDistrictsList] = useState([[]]);
    const [wardsList, setWardsList] = useState([[]]);
    const [addresses, setAddresses] = useState([
        { city: '', district: '', ward: '', street: '', status: 'DEFAULT' }
    ]);
    const [openError, setOpenError] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [openCancel, setOpenCancel] = useState(false);
    const [pendingSubmit, setPendingSubmit] = useState(false);

    useEffect(() => {
        axios.get('https://provinces.open-api.vn/api/p/')
            .then(res => setCities(res.data))
            .catch(() => setCities([]));
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onload = (ev) => setImagePreview(ev.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSetDefaultAddress = (idx) => {
        setAddresses(addresses.map((addr, i) =>
            i === idx ? { ...addr, status: addr.status === 'DEFAULT' ? null : 'DEFAULT' } : { ...addr, status: null }
        ));
    };

    const handleAddressChange = (e, idx) => {
        const { name, value } = e.target;
        const newAddresses = addresses.map((addr, i) =>
            i === idx
                ? { ...addr, [name]: value, ...(name === 'city' ? { district: '', ward: '' } : {}), ...(name === 'district' ? { ward: '' } : {}) }
                : addr
        );
        setAddresses(newAddresses);
        if (name === 'city') {
            const selectedCity = cities.find(c => c.name === value);
            if (selectedCity) {
                axios.get(`https://provinces.open-api.vn/api/p/${selectedCity.code}?depth=2`)
                    .then(res => {
                        const newDistrictsList = [...districtsList];
                        newDistrictsList[idx] = res.data.districts;
                        setDistrictsList(newDistrictsList);
                        const newWardsList = [...wardsList];
                        newWardsList[idx] = [];
                        setWardsList(newWardsList);
                    });
            }
        }
        if (name === 'district') {
            const selectedDistrict = districtsList[idx]?.find(d => d.name === value);
            if (selectedDistrict) {
                axios.get(`https://provinces.open-api.vn/api/d/${selectedDistrict.code}?depth=2`)
                    .then(res => {
                        const newWardsList = [...wardsList];
                        newWardsList[idx] = res.data.wards;
                        setWardsList(newWardsList);
                    });
            }
        }
    };

    const handleAddAddress = () => {
        if (addresses.length < MAX_ADDRESSES) {
            setAddresses([...addresses, { city: '', district: '', ward: '', street: '', status: null }]);
            setDistrictsList([...districtsList, []]);
            setWardsList([...wardsList, []]);
        }
    };

    const handleRemoveAddress = (idx) => {
        const isDefault = addresses[idx].status === 'DEFAULT';
        const newAddresses = addresses.filter((_, i) => i !== idx);
        const newDistrictsList = districtsList.filter((_, i) => i !== idx);
        const newWardsList = wardsList.filter((_, i) => i !== idx);
        // Nếu xoá địa chỉ mặc định
        if (isDefault && newAddresses.length > 0) {
            // Nếu còn địa chỉ phía dưới, đặt nó làm mặc định, nếu không thì địa chỉ đầu tiên
            const nextIdx = idx < newAddresses.length ? idx : 0;
            newAddresses[nextIdx] = { ...newAddresses[nextIdx], status: 'DEFAULT' };
            // Các địa chỉ khác không phải mặc định
            for (let i = 0; i < newAddresses.length; i++) {
                if (i !== nextIdx) newAddresses[i] = { ...newAddresses[i], status: null };
            }
        }
        setAddresses(newAddresses);
        setDistrictsList(newDistrictsList);
        setWardsList(newWardsList);
    };

    // Tính ngày tối đa cho ngày sinh (phải đủ 15 tuổi)
    const today = new Date();
    const maxBirthDate = new Date(today.getFullYear() - 15, today.getMonth(), today.getDate());
    const maxBirthDateStr = maxBirthDate.toISOString().split('T')[0];

    // Validation giống nhân viên, bổ sung check tuổi >= 15 nếu có ngày sinh
    const validateForm = () => {
        if (!form.customerName.trim()) return "Vui lòng nhập họ và tên.";
        if (!form.email.trim()) return "Vui lòng nhập email.";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (form.email && !emailRegex.test(form.email)) return "Email không đúng định dạng.";
        if (!form.phoneNumber.trim()) return "Vui lòng nhập số điện thoại.";
        if (!/^((03|05|07|08|09)[0-9]{8})$/.test(form.phoneNumber)) return "Số điện thoại không hợp lệ.";
        if (form.birthDate) {
            const birth = new Date(form.birthDate);
            if (birth > maxBirthDate) return "Khách hàng phải từ 15 tuổi trở lên.";
        }
        // Validate tất cả địa chỉ phải đầy đủ nếu có nhiều hơn 1 địa chỉ
        for (let i = 0; i < addresses.length; i++) {
            const addr = addresses[i];
            if (!addr.city || !addr.district || !addr.ward || !addr.street.trim()) {
                return `Vui lòng nhập đầy đủ thông tin cho địa chỉ ${i + 1}. Nếu không muốn thêm, hãy xoá địa chỉ đó.`;
            }
        }
        return "";
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errMsg = validateForm();
        if (errMsg) {
            setError(errMsg);
            setOpenError(true);
            return;
        }
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
            formData.append('customerCreateRequest', new Blob([JSON.stringify(form)], { type: 'application/json' }));
            formData.append('addressesRequest', new Blob([JSON.stringify(addresses)], { type: 'application/json' }));
            if (imageFile) formData.append('imageFile', imageFile);
            const res = await axios.post("http://localhost:8080/admin/customer", formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            if (res.data.status === 201) {
                setSuccess("Thêm khách hàng thành công!");
                setTimeout(() => navigate("/khachhang"), 1200);
            } else {
                setError(res.data.message || "Có lỗi xảy ra");
                setOpenError(true);
            }
        } catch (err) {
            setError("Có lỗi xảy ra khi thêm khách hàng!");
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
        navigate("/khachhang");
    };
    const handleCancelClose = () => {
        setOpenCancel(false);
    };

    // Helper để render label có dấu * đỏ nếu là bắt buộc
    const requiredLabel = (label, required) => (
        <span>{label} {required && <span style={{ color: '#e53935' }}>*</span>}</span>
    );

    useEffect(() => {
        if (error) setOpenError(true);
    }, [error]);

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <SoftBox py={5} sx={{ background: "#f6f7fb", minHeight: "100vh", width: '100%', px: 0 }}>
                <SoftBox width="100%" maxWidth="100%" px={0}>
                    <Card sx={{ borderRadius: 4, boxShadow: 2, p: { xs: 2, md: 5 }, background: '#fff', width: '100%', minHeight: 650, display: 'block', mx: 0, px: 4 }}>
                        <h2 style={{ fontWeight: 700, color: '#384D6C', margin: '32px 0 24px 0', fontSize: 30, textAlign: 'left' }}>Thêm Khách Hàng</h2>
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
                                    <Avatar src={imagePreview} sx={{ width: 180, height: 180, mb: 2, border: '2px solid #49a3f1', fontSize: 60, bgcolor: '#e3f0fc', color: '#1976d2' }}>
                                        {!imagePreview && form.customerName ? form.customerName.charAt(0).toUpperCase() : null}
                                    </Avatar>
                                    <label htmlFor="upload-avatar-customer">
                                        <input accept="image/*" id="upload-avatar-customer" type="file" style={{ display: 'none' }} onChange={handleImageChange} />
                                        <Button variant="outlined" component="span" startIcon={<PhotoCamera />} sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 500 }}>
                                            Chọn ảnh
                                        </Button>
                                    </label>
                                    {imageFile && (
                                        <span style={{ fontSize: 13, color: '#888', marginTop: 8 }}>{imageFile.name}</span>
                                    )}
                                </Grid>
                                <Grid item xs={12} md={8} display="flex" flexDirection="column" justifyContent="center" sx={{ width: '100%' }}>
                                    <Grid container spacing={3} sx={{ width: '100%' }}>
                                        <Grid item xs={12}>
                                            <TextField label={requiredLabel("Họ và tên", true)} name="customerName" value={form.customerName} onChange={handleChange} fullWidth size="medium" InputLabelProps={{ shrink: true, style: { top: 0, fontSize: 16, background: '#fff', padding: '0 4px' } }} sx={{ mb: 2, minWidth: 320 }} />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField label={requiredLabel("Số điện thoại", true)} name="phoneNumber" value={form.phoneNumber} onChange={handleChange} fullWidth size="medium" inputProps={{ maxLength: 10 }} InputLabelProps={{ shrink: true, style: { top: 0, fontSize: 16, background: '#fff', padding: '0 4px' } }} sx={{ mb: 2, minWidth: 220 }} />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField label={requiredLabel("Email", true)} name="email" value={form.email} onChange={handleChange} fullWidth size="medium" InputLabelProps={{ shrink: true, style: { top: 0, fontSize: 16, background: '#fff', padding: '0 4px' } }} sx={{ mb: 2, minWidth: 220 }} />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                label={requiredLabel("Ngày sinh", false)}
                                                name="birthDate"
                                                type="date"
                                                value={form.birthDate}
                                                onChange={handleChange}
                                                fullWidth
                                                size="medium"
                                                InputLabelProps={{ shrink: true, style: { top: 0, fontSize: 16, background: '#fff', padding: '0 4px' } }}
                                                sx={{ mb: 2, minWidth: 220 }}
                                                inputProps={{ max: maxBirthDateStr }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} display="flex" alignItems="center">
                                            <span style={{ fontWeight: 500, fontSize: 16, marginRight: 16, minWidth: 80 }}>Giới tính</span>
                                            <RadioGroup row name="gender" value={form.gender} onChange={handleChange}>
                                                <FormControlLabel value="MALE" control={<Radio color="primary" />} label="Nam" />
                                                <FormControlLabel value="FEMALE" control={<Radio color="primary" />} label="Nữ" />
                                            </RadioGroup>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <Grid item xs={12} display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                                        <h4 style={{ margin: 0, fontWeight: 600 }}>Địa chỉ <span style={{ fontWeight: 400, fontSize: 15, color: '#888' }}>({addresses.length} / {MAX_ADDRESSES})</span></h4>
                                        {addresses.length < MAX_ADDRESSES && (
                                            <Button
                                                variant="outlined"
                                                color="info"
                                                onClick={handleAddAddress}
                                                size="small"
                                                sx={{ borderColor: '#49a3f1', color: '#1976d2', fontWeight: 500, background: '#e3f0fc', '&:hover': { background: '#b6e0fe', borderColor: '#1976d2', color: '#1769aa' } }}
                                            >
                                                + Thêm địa chỉ
                                            </Button>
                                        )}
                                    </Grid>
                                    <Card sx={{ p: 3, borderRadius: 3, background: '#fff', boxShadow: 0, overflow: 'visible' }}>
                                        <Grid container spacing={2} direction="column">
                                            {addresses
                                                .map((address, idx) => ({ address, idx }))
                                                .sort((a, b) => (a.address.status === 'DEFAULT' ? -1 : 1))
                                                .map(({ address, idx }) => {
                                                    // Chỉ dòng mặc định mới có * ở label
                                                    const isDefault = address.status === 'DEFAULT';
                                                    const showRequired = isDefault;
                                                    return (
                                                        <Grid container spacing={1} alignItems="center" key={idx} wrap="nowrap" sx={{ minHeight: 56 }}>
                                                            <Grid item sx={{ width: 36, minWidth: 36, display: 'flex', justifyContent: 'center' }}>
                                                                <input
                                                                    type="checkbox"
                                                                    checked={isDefault}
                                                                    onChange={() => handleSetDefaultAddress(idx)}
                                                                    style={{ width: 20, height: 20, accentColor: '#1976d2' }}
                                                                    title="Chọn làm địa chỉ mặc định"
                                                                />
                                                            </Grid>
                                                            <Grid item sx={{ minWidth: 140, flex: 1 }}>
                                                                <Select
                                                                    label={requiredLabel("Tỉnh/Thành phố", showRequired)}
                                                                    name="city"
                                                                    value={address.city}
                                                                    onChange={e => handleAddressChange(e, idx)}
                                                                    fullWidth
                                                                    size="small"
                                                                    displayEmpty
                                                                    disabled={cities.length === 0}
                                                                    inputProps={{ 'aria-label': 'Tỉnh/Thành phố' }}
                                                                    sx={{ background: '#f5f6fa', borderRadius: 2, fontSize: 15, fontWeight: 500, color: '#384D6C', border: '1px solid #bdbdbd', minHeight: 40 }}
                                                                    MenuProps={{ PaperProps: { sx: { borderRadius: 2, mt: 0.5 } } }}
                                                                >
                                                                    <MenuItem value="" disabled>{cities.length === 0 ? 'Đang tải...' : 'Chọn tỉnh/thành phố'}</MenuItem>
                                                                    {cities.map((c) => (
                                                                        <MenuItem key={c.code} value={c.name}>{c.name}</MenuItem>
                                                                    ))}
                                                                </Select>
                                                            </Grid>
                                                            <Grid item sx={{ minWidth: 140, flex: 1 }}>
                                                                <Select
                                                                    label={requiredLabel("Quận/Huyện", showRequired)}
                                                                    name="district"
                                                                    value={address.district}
                                                                    onChange={e => handleAddressChange(e, idx)}
                                                                    fullWidth
                                                                    size="small"
                                                                    displayEmpty
                                                                    disabled={!address.city}
                                                                    inputProps={{ 'aria-label': 'Quận/Huyện' }}
                                                                    sx={{ background: '#f5f6fa', borderRadius: 2, fontSize: 15, fontWeight: 500, color: '#384D6C', border: '1px solid #bdbdbd', minHeight: 40 }}
                                                                    MenuProps={{ PaperProps: { sx: { borderRadius: 2, mt: 0.5 } } }}
                                                                >
                                                                    <MenuItem value="" disabled>Chọn quận/huyện</MenuItem>
                                                                    {districtsList[idx]?.map((d) => (
                                                                        <MenuItem key={d.code} value={d.name}>{d.name}</MenuItem>
                                                                    ))}
                                                                </Select>
                                                            </Grid>
                                                            <Grid item sx={{ minWidth: 140, flex: 1 }}>
                                                                <Select
                                                                    label={requiredLabel("Xã/Phường", showRequired)}
                                                                    name="ward"
                                                                    value={address.ward}
                                                                    onChange={e => handleAddressChange(e, idx)}
                                                                    fullWidth
                                                                    size="small"
                                                                    displayEmpty
                                                                    disabled={!address.district}
                                                                    inputProps={{ 'aria-label': 'Xã/Phường' }}
                                                                    sx={{ background: '#f5f6fa', borderRadius: 2, fontSize: 15, fontWeight: 500, color: '#384D6C', border: '1px solid #bdbdbd', minHeight: 40 }}
                                                                    MenuProps={{ PaperProps: { sx: { borderRadius: 2, mt: 0.5 } } }}
                                                                >
                                                                    <MenuItem value="" disabled>Chọn xã/phường</MenuItem>
                                                                    {wardsList[idx]?.map((w) => (
                                                                        <MenuItem key={w.code} value={w.name}>{w.name}</MenuItem>
                                                                    ))}
                                                                </Select>
                                                            </Grid>
                                                            <Grid item sx={{ minWidth: 180, flex: 2 }}>
                                                                <TextField
                                                                    label={"Số nhà/Ngõ/Đường"}
                                                                    name="street"
                                                                    value={address.street}
                                                                    onChange={e => handleAddressChange(e, idx)}
                                                                    fullWidth
                                                                    size="small"
                                                                    InputLabelProps={{ shrink: true, style: { top: 0, fontSize: 16, background: '#fff', padding: '0 4px' } }}
                                                                />
                                                            </Grid>
                                                            <Grid item sx={{ width: 64, minWidth: 48, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                                                {addresses.length > 1 && (
                                                                    <Button
                                                                        variant="outlined"
                                                                        color="error"
                                                                        onClick={() => handleRemoveAddress(idx)}
                                                                        sx={{ ml: 1, borderColor: '#e53935', color: '#e53935', fontWeight: 500, background: '#ffebee', '&:hover': { background: '#ffcdd2', borderColor: '#b71c1c', color: '#b71c1c' }, minWidth: 40, px: 0 }}
                                                                    >
                                                                        Xoá
                                                                    </Button>
                                                                )}
                                                            </Grid>
                                                        </Grid>
                                                    );
                                                })}
                                        </Grid>
                                    </Card>
                                </Grid>
                                <Grid item xs={12}>
                                    <SoftBox mt={4} display="flex" justifyContent="flex-end" gap={2}>
                                        <Button variant="outlined" color="secondary" size="large" sx={{ minWidth: 120, fontWeight: 600, borderRadius: 2 }} onClick={handleCancel} disabled={loading}>
                                            Hủy
                                        </Button>
                                        <Button type="submit" variant="contained" color="primary" size="large" sx={{ minWidth: 180, fontWeight: 600, borderRadius: 2, background: '#1976d2', '&:hover': { background: '#125ea2' } }} disabled={loading}>
                                            {loading ? "Đang thêm..." : "Thêm Khách Hàng"}
                                        </Button>
                                    </SoftBox>
                                </Grid>
                            </Grid>
                        </form>
                        {/* Dialog xác nhận thêm khách hàng */}
                        <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
                            <DialogTitle>Xác nhận thêm khách hàng</DialogTitle>
                            <DialogContent>
                                <DialogContentText>Bạn có chắc chắn muốn thêm khách hàng này không?</DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setOpenConfirm(false)} color="secondary">Hủy</Button>
                                <Button onClick={handleConfirm} color="primary" variant="contained">Xác nhận</Button>
                            </DialogActions>
                        </Dialog>
                        {/* Dialog xác nhận hủy */}
                        <Dialog open={openCancel} onClose={handleCancelClose}>
                            <DialogTitle>Xác nhận hủy thao tác</DialogTitle>
                            <DialogContent>
                                <DialogContentText>Bạn có chắc chắn muốn hủy và quay lại trang danh sách khách hàng không?</DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCancelClose} color="primary">Không</Button>
                                <Button onClick={handleCancelConfirm} color="error" variant="contained">Có, quay lại</Button>
                            </DialogActions>
                        </Dialog>
                    </Card>
                </SoftBox>
            </SoftBox>
            <Footer />
        </DashboardLayout>
    );
}

export default ThemKhachHang;
