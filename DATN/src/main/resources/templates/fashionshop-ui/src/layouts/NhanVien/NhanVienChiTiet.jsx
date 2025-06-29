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
import axios from "axios";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import DiaChiNhanVien from "./DiaChiNhanVien";

function NhanVienChiTiet() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:8080/admin/employee/${id}`)
      .then(res => {
        setData(res.data.data);
        // Lưu mã nhân viên vào localStorage để DashboardNavbar có thể lấy
        if (res.data.data && res.data.data.employeeCode) {
          localStorage.setItem("currentEmployeeCode", res.data.data.employeeCode);
        }
      })
      .catch(() => setError("Không thể tải dữ liệu nhân viên"))
      .finally(() => setLoading(false));
  }, [id]);

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

  if (loading) return <SoftBox display="flex" justifyContent="center" alignItems="center" minHeight="60vh"><CircularProgress /></SoftBox>;
  if (error) return <SoftBox color="error.main" textAlign="center">{error}</SoftBox>;
  if (!data) return null;

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3} sx={{ background: "#f6f7fb", minHeight: "100vh", fontFamily: 'Roboto, Helvetica, Arial, sans-serif', px: 0 }}>
        <SoftBox width="100%" maxWidth="100%" px={0}>
          <SoftBox display="flex" alignItems="center" mb={3} px={4}>
            <Button 
              variant="contained"
              startIcon={<FaArrowLeft />} 
              sx={{ 
                borderRadius: 2, 
                textTransform: "none", 
                mr: 2, 
                fontSize: 15, 
                fontWeight: 500, 
                backgroundColor: '#1976d2', 
                color: '#fff',
                '&:hover': { backgroundColor: '#115293' }
              }} 
              onClick={() => navigate(-1)}
            >
              Quay lại
            </Button>
            <h2 style={{ fontWeight: 700, color: '#384D6C', margin: 0, fontSize: 28, fontFamily: 'Roboto, Helvetica, Arial, sans-serif' }}>Thông Tin Nhân Viên</h2>
          </SoftBox>
          <Card sx={{ borderRadius: 4, boxShadow: 2, p: { xs: 2, md: 5 }, background: '#fff', width: '100%', minHeight: '75vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', mx: 0, px: 4 }}>
            <SoftBox display="flex" flexDirection="column" alignItems="center" mb={2}>
              {data.imageResponse && data.imageResponse.imageUrl ? (
                <img src={data.imageResponse.imageUrl} alt="avatar" style={{ width: 180, height: 180, borderRadius: "50%", objectFit: "cover", border: "2px solid #49a3f1", marginBottom: 8, background: '#e3f0fc' }} />
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
              <h3 style={{ fontWeight: 600, margin: 0, fontSize: 22 }}>{data.employeeName}</h3>
              <div style={{ color: '#888', fontWeight: 500, marginBottom: 8, fontSize: 15 }}>{data.role === "ADMIN" ? "Quản Lí" : "Nhân Viên Bán Hàng"}</div>
            </SoftBox>
            <SoftBox component="form" autoComplete="off" px={{ xs: 0, md: 4 }} width="100%">
              <h4 style={{ color: '#384D6C', fontWeight: 600, marginBottom: 16, fontSize: 18 }}>Thông tin nhân viên</h4>
              <SoftBox display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr 1fr' }} gap={3} mb={2} width="100%">
                <div style={{ border: '1px solid #e0e0e0', borderRadius: 8, padding: 16, background: '#fafbfc' }}>
                  <div style={{ fontWeight: 500, color: '#888', fontSize: 14 }}>Mã Nhân Viên</div>
                  <div style={{ fontSize: 15, color: '#222', wordBreak: 'break-word' }}>{data.employeeCode || ''}</div>
                </div>
                <div style={{ border: '1px solid #e0e0e0', borderRadius: 8, padding: 16, background: '#fafbfc' }}>
                  <div style={{ fontWeight: 500, color: '#888', fontSize: 14 }}>Giới Tính</div>
                  <div style={{ fontSize: 15, color: '#222' }}>{data.gender === "MALE" ? "Nam" : data.gender === "FEMALE" ? "Nữ" : "Khác"}</div>
                </div>
                <div style={{ border: '1px solid #e0e0e0', borderRadius: 8, padding: 16, background: '#fafbfc' }}>
                  <div style={{ fontWeight: 500, color: '#888', fontSize: 14 }}>CCCD</div>
                  <div style={{ fontSize: 15, color: '#222', wordBreak: 'break-word' }}>{data.citizenId || ''}</div>
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
              <DiaChiNhanVien addressResponse={data.addressResponse} />
              <h4 style={{ color: '#384D6C', fontWeight: 600, marginBottom: 16, marginTop: 24, fontSize: 18 }}>Thông tin liên lạc</h4>
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
        </SoftBox>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default NhanVienChiTiet;
