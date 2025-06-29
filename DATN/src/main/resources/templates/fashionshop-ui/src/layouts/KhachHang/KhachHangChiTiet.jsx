import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import SoftBox from "components/SoftBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Icon from "@mui/material/Icon";
import CircularProgress from "@mui/material/CircularProgress";
import { FaArrowLeft } from "react-icons/fa";
import Chip from "@mui/material/Chip";
import { getCustomerById } from "../../apis/customer";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import TextField from "@mui/material/TextField";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

function KhachHangChiTiet() {
    const { customerId } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        setLoading(true);
        getCustomerById(customerId)
            .then((customer) => {
                setData(customer);
                setAddresses(customer.addressCustomerResponses || []);
            })
            .catch(() => setError("Không thể tải dữ liệu khách hàng"))
            .finally(() => setLoading(false));
    }, [customerId]);

    useEffect(() => {
        if (data) {
            setEditData({
                customerName: data.customerName || '',
                phoneNumber: data.phoneNumber || '',
                email: data.email || '',
                birthDate: data.birthDate || '',
                gender: data.gender || '',
            });
        }
    }, [data]);

    // Tính tuổi từ ngày sinh
    function tinhTuoi(birthDate) {
        if (!birthDate) return '';
        const today = new Date();
        const dob = new Date(birthDate);
        let age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
            age--;
        }
        return age;
    }

    const handleEditClick = () => setIsEditing(true);
    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditData({
            customerName: data.customerName || '',
            phoneNumber: data.phoneNumber || '',
            email: data.email || '',
            birthDate: data.birthDate || '',
            gender: data.gender || '',
        });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditData((prev) => ({ ...prev, [name]: value }));
    };

    const handleGenderChange = (e) => {
        setEditData((prev) => ({ ...prev, gender: e.target.value }));
    };

    const handleSaveEdit = async () => {
        // Validate (ví dụ: không để trống tên, sđt, email)
        if (!editData.customerName.trim() || !editData.phoneNumber.trim() || !editData.email.trim()) {
            setSnackbar({ open: true, message: 'Vui lòng nhập đầy đủ thông tin bắt buộc!', severity: 'error' });
            return;
        }
        try {
            const updateData = {
                id: customerId,
                customerName: editData.customerName,
                phoneNumber: editData.phoneNumber,
                email: editData.email,
                birthDate: editData.birthDate,
                gender: editData.gender,
                status: data.status
            };
            const formData = new FormData();
            formData.append(
                "CustomerUpdateRequest",
                new Blob([JSON.stringify(updateData)], { type: "application/json" })
            );
            // Nếu có upload avatar thì thêm vào formData ở bước sau
            const response = await fetch(`http://localhost:8080/admin/customer/${customerId}`, {
                method: "PATCH",
                body: formData
            });
            if (response.ok) {
                setSnackbar({ open: true, message: 'Cập nhật thành công!', severity: 'success' });
                setIsEditing(false);
                // Reload lại thông tin
                getCustomerById(customerId).then((customer) => {
                    setData(customer);
                    setAddresses(customer.addressCustomerResponses || []);
                });
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

    // Xem thông tin khách hàng và địa chỉ, không cho chỉnh sửa, không có nút thừa
    return (
        <DashboardLayout>
            <DashboardNavbar />
            <SoftBox py={3} sx={{ background: "#f6f7fb", minHeight: "100vh", fontFamily: 'Roboto, Helvetica, Arial, sans-serif', px: 0 }}>
                <SoftBox width="100%" maxWidth="100%" px={0}>
                    <SoftBox display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3} alignItems="flex-start">
                        {/* Thông tin khách hàng */}
                        <Card sx={{ flex: 6, borderRadius: 4, boxShadow: 2, p: 3, background: '#fff', minWidth: 350, maxWidth: '100%' }}>
                            <div style={{ fontWeight: 700, fontSize: 20, color: '#384D6C', marginBottom: 16 }}>Thông tin Khách Hàng</div>
                            <SoftBox display="flex" flexDirection="column" alignItems="center" mb={2}>
                                {data.imageResponse && data.imageResponse.imageUrl ? (
                                    <img src={data.imageResponse.imageUrl} alt="avatar" style={{ width: 180, height: 180, borderRadius: "50%", objectFit: "cover", border: "2px solid #49a3f1", marginBottom: 8, background: '#e3f0fc' }} />
                                ) : (
                                    <div style={{ width: 180, height: 180, borderRadius: '50%', background: '#e3e3e3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64, fontWeight: 700, color: '#384D6C', border: '2px solid #49a3f1', marginBottom: 8 }}>
                                        {data.customerName?.charAt(0)?.toUpperCase() || 'U'}
                                    </div>
                                )}
                                <h3 style={{ fontWeight: 600, margin: 0, fontSize: 22 }}>{data.customerName}</h3>
                                <div style={{ color: '#888', fontWeight: 500, marginBottom: 8, fontSize: 15 }}>{data.status === "ACTIVE" ? "Khách hàng hoạt động" : "Khách hàng không hoạt động"}</div>
                                <Button variant="contained" color="primary" sx={{ mt: 1, fontWeight: 600, fontSize: 15 }} onClick={() => navigate(`/khachhang/capnhat/${customerId}`)}>
                                    Cập nhật thông tin
                                </Button>
                            </SoftBox>
                            <SoftBox px={{ xs: 0, md: 4 }} width="100%">
                                <h4 style={{ color: '#384D6C', fontWeight: 600, marginBottom: 16, fontSize: 18 }}>Thông tin khách hàng</h4>
                                <SoftBox display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }} gap={3} mb={2} width="100%">
                                    <div style={{ border: '1px solid #e0e0e0', borderRadius: 8, padding: 16, background: '#fafbfc' }}>
                                        <div style={{ fontWeight: 500, color: '#888', fontSize: 14 }}>Mã Khách Hàng</div>
                                        <div style={{ fontSize: 15, color: '#222', wordBreak: 'break-word' }}>{data.customerCode || ''}</div>
                                    </div>
                                    <div style={{ border: '1px solid #e0e0e0', borderRadius: 8, padding: 16, background: '#fafbfc' }}>
                                        <div style={{ fontWeight: 500, color: '#888', fontSize: 14 }}>Giới Tính</div>
                                        <div style={{ fontSize: 15, color: '#222' }}>{data.gender === "MALE" ? "Nam" : data.gender === "FEMALE" ? "Nữ" : "Khác"}</div>
                                    </div>
                                    <div style={{ border: '1px solid #e0e0e0', borderRadius: 8, padding: 16, background: '#fafbfc' }}>
                                        <div style={{ fontWeight: 500, color: '#888', fontSize: 14 }}>Ngày Sinh</div>
                                        <div style={{ fontSize: 15, color: '#222' }}>{data.birthDate || ''}</div>
                                    </div>
                                    <div style={{ border: '1px solid #e0e0e0', borderRadius: 8, padding: 16, background: '#fafbfc' }}>
                                        <div style={{ fontWeight: 500, color: '#888', fontSize: 14 }}>Tuổi</div>
                                        <div style={{ fontSize: 15, color: '#222' }}>{tinhTuoi(data.birthDate)}</div>
                                    </div>
                                </SoftBox>
                                <h4 style={{ color: '#384D6C', fontWeight: 600, marginBottom: 16, fontSize: 18 }}>Thông tin liên lạc</h4>
                                <SoftBox display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }} gap={3} mb={2} width="100%">
                                    <div style={{ minWidth: 0, border: '1px solid #e0e0e0', borderRadius: 8, padding: 16, background: '#fafbfc' }}>
                                        <div style={{ fontWeight: 500, color: '#888', fontSize: 14 }}>Email</div>
                                        <div style={{ fontSize: 15, color: '#222', wordBreak: 'break-all', whiteSpace: 'pre-line', overflowWrap: 'break-word' }}>{data.email || ''}</div>
                                    </div>
                                    <div style={{ border: '1px solid #e0e0e0', borderRadius: 8, padding: 16, background: '#fafbfc' }}>
                                        <div style={{ fontWeight: 500, color: '#888', fontSize: 14 }}>Số Điện Thoại</div>
                                        <div style={{ fontSize: 15, color: '#222' }}>{data.phoneNumber || ''}</div>
                                    </div>
                                </SoftBox>
                            </SoftBox>
                        </Card>
                        {/* Thông tin địa chỉ */}
                        <Card sx={{ flex: 4, minWidth: 320, maxWidth: 500, borderRadius: 4, boxShadow: 2, p: 3, background: '#fff', alignSelf: 'flex-start', ml: { md: 2, xs: 0 } }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 700, fontSize: 18, color: '#384D6C', marginBottom: 12 }}>
                                <span>Thông tin Địa Chỉ</span>
                                <span style={{ fontWeight: 500, fontSize: 15, color: '#1976d2' }}>{addresses.length}/3</span>
                            </div>
                            {addresses.length === 0 ? (
                                <div style={{ color: '#bdbdbd', fontStyle: 'italic' }}>Chưa có địa chỉ</div>
                            ) : (
                                addresses.map((addr, idx) => (
                                    <Card key={addr.id} sx={{ mb: 2, p: 2, background: addr.status === "DEFAULT" ? '#e3f2fd' : '#f9f9f9', border: '1px solid #e0e0e0', borderRadius: 3, boxShadow: addr.status === "DEFAULT" ? 2 : 0 }}>
                                        <SoftBox display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                            <div style={{ fontWeight: 600, color: addr.status === "DEFAULT" ? '#1976d2' : '#384D6C' }}>Địa chỉ {idx + 1}</div>
                                            {addr.status === "DEFAULT" && <Chip label="Mặc định" color="primary" size="small" />}
                                        </SoftBox>
                                        <div style={{ fontSize: 15, color: '#222', marginBottom: 8, paddingLeft: 4, borderLeft: '3px solid #1976d2' }}>{addr.street}, {addr.ward}, {addr.district}, {addr.city}</div>
                                    </Card>
                                ))
                            )}
                        </Card>
                    </SoftBox>
                </SoftBox>
            </SoftBox>
            <Footer />
        </DashboardLayout>
    );
}

export default KhachHangChiTiet;
