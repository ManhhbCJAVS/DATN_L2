import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import Input from "@mui/material/Input";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import SoftBox from "components/SoftBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Icon from "@mui/material/Icon";
import Table from "examples/Tables/Table";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import Switch from "@mui/material/Switch";
import axios from "axios";
import Menu from "@mui/material/Menu";
import Popover from "@mui/material/Popover";
import Slider from "@mui/material/Slider";

function NhanVienTable() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [gender, setGender] = useState("");
  const [status, setStatus] = useState("");
  const [phone, setPhone] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5); // Mặc định là 5
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [ageRange, setAgeRange] = useState([18, 100]);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios.get("http://localhost:8080/admin/employee", {
      params: {
        pageNo: page,
        pageSize,
        sortBy,
        sortDir,
        filterByEmployeeName: search || undefined,
        filterByGender: gender || undefined,
        filterByStatus: status || undefined,
        filterByPhoneNumber: phone || undefined,
        minAge: minAge || undefined,
        maxAge: maxAge || undefined,
      },
    })
      .then((res) => {
        setEmployees(res.data.data.content || []);
        setTotalPages(res.data.data.totalPages || 1);
        setTotalElements(res.data.data.totalElements || 0);
      })
      .catch(() => setError("Không thể tải dữ liệu"))
      .finally(() => setLoading(false));
  }, [search, gender, status, phone, page, pageSize, sortBy, sortDir, minAge, maxAge]);

  // Table columns theo đúng thứ tự và hiển thị như giao diện ảnh
  const columns = [
    { name: "stt", label: "STT", align: "center", width: "50px" },
    {
      name: "imageResponse", label: "Ảnh", align: "center", width: "60px",
      render: (value, row) => value?.imageUrl 
        ? <img src={value.imageUrl} alt="avatar" style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", display: 'block', margin: '0 auto' }} /> 
        : <div style={{width:36,height:36,borderRadius:"50%",background:"#e3e3e3",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:600,textAlign:'center',margin:'0 auto'}}>{row.employeeName?.charAt(0)?.toUpperCase() || 'U'}</div>
    },
    { name: "employeeCode", label: "Mã NV", align: "center", width: "90px" },
    {
      name: "employeeName", label: "Họ tên & Email", align: "left", width: "200px",
      render: (value, row) => (
        <div>
          <div style={{ fontWeight: 500 }}>{row.employeeName}</div>
          <div style={{ fontSize: 13, color: "#888" }}>{row.email}</div>
        </div>
      )
    },
    { name: "role", label: "Chức vụ", align: "center", width: "100px",
      render: (value) => value === "EMPLOYEE" ? "Nhân Viên" : value === "ADMIN" ? "Quản Lí" : value
    },
    { name: "phoneNumber", label: "SĐT", align: "center", width: "110px" },
    { name: "gender", label: "Giới tính", align: "center", width: "80px",
      render: (value) => value === "MALE" ? "Nam" : value === "FEMALE" ? "Nữ" : "Khác"
    },
    {
      name: "addressResponse", label: "Địa chỉ", align: "left", width: "220px",
      render: (value) => value ? `${value.city}, ${value.district}, ${value.ward}, ${value.street}` : ""
    },
    {
      name: "status", label: "Trạng thái", align: "center", width: "90px",
      render: (value) => (
        <span
          style={{
            display: "inline-block",
            minWidth: 70,
            padding: "2px 12px",
            borderRadius: 12,
            fontWeight: 500,
            fontSize: 13,
            background: value === "ACTIVE" ? "#e6f4ea" : "#f4f6fb",
            color: value === "ACTIVE" ? "#219653" : "#bdbdbd",
            border: `1px solid ${value === "ACTIVE" ? "#219653" : "#bdbdbd"}`,
            textAlign: "center"
          }}
        >
          {value === "ACTIVE" ? "Đang làm" : "Nghỉ việc"}
        </span>
      )
    },
    {
      name: "actions",
      label: "Hành động",
      align: "center",
      width: "90px",
      render: (_, row) => (
        <SoftBox display="flex" gap={0.5} justifyContent="center">
          <IconButton size="small" title="Chi tiết" onClick={() => navigate(`/NhanVien/ChiTiet/${row.id}`)}><FaEye /></IconButton>
          <IconButton size="small" title="Sửa" onClick={() => navigate(`/NhanVien/CapNhat/${row.id}`)}><FaEdit /></IconButton>
        </SoftBox>
      ),
    },
  ];

  const rows = employees.map((item, idx) => ({
    stt: (page - 1) * pageSize + idx + 1,
    ...item,
    actions: "",
  }));

  // Pagination helper giống SanPham
  function getPaginationItems(current, total) {
    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
    if (current <= 2) return [1, 2, "...", total - 1, total];
    if (current >= total - 1) return [1, 2, "...", total - 1, total];
    return [1, 2, "...", current, "...", total - 1, total];
  }
  const paginationItems = getPaginationItems(page, totalPages);

  // Pagination rendering (có thể custom thêm)
  const tableFontStyle = {
    fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
    fontSize: 15,
    color: '#222',
  };

  // Khi thay đổi slider tuổi
  const handleAgeRangeChange = (event, newValue) => {
    setAgeRange(newValue);
    setMinAge(newValue[0]);
    setMaxAge(newValue[1]);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3} sx={{ background: "#F4F6FB", minHeight: "100vh" }}>
        <Card sx={{ p: { xs: 2, md: 3 }, mb: 2 }}>
          <SoftBox display="flex" gap={2} alignItems="center" flexWrap="wrap" sx={{ fontFamily: 'Roboto', fontSize: 15 }}>
            <Input
              placeholder="Nhập tên nhân viên"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              startAdornment={<InputAdornment position="start"><Icon fontSize="small">search</Icon></InputAdornment>}
              sx={{ background: "#f5f6fa", borderRadius: 2, p: 0.5, color: "#222", minWidth: 180 }}
            />
            <Input
              placeholder="Nhập SĐT"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              sx={{ background: "#f5f6fa", borderRadius: 2, p: 0.5, color: "#222", minWidth: 120 }}
              inputProps={{ maxLength: 10 }}
            />
            {/* Icon filter mở popover */}
            <IconButton onClick={e => setFilterAnchorEl(e.currentTarget)} sx={{ color: '#49a3f1', border: '1px solid #49a3f1', borderRadius: 2, ml: 1 }}>
              <Icon>filter_list</Icon>
            </IconButton>
            <Popover
              open={Boolean(filterAnchorEl)}
              anchorEl={filterAnchorEl}
              onClose={() => setFilterAnchorEl(null)}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              PaperProps={{ sx: { p: 2, minWidth: 320, borderRadius: 3, background: '#f5f6fa' } }}
            >
              <SoftBox display="flex" flexDirection="column" gap={2}>
                {/* Khoảng tuổi */}
                <div>
                  <span style={{ fontSize: 13, color: '#888', fontWeight: 500 }}>Khoảng tuổi</span>
                  <Slider
                    value={ageRange}
                    onChange={handleAgeRangeChange}
                    valueLabelDisplay="auto"
                    min={18}
                    max={100}
                    sx={{ mt: 1, color: '#1976d2', '& .MuiSlider-thumb': { bgcolor: '#1976d2' }, '& .MuiSlider-track': { bgcolor: '#1976d2' }, '& .MuiSlider-rail': { bgcolor: '#bdbdbd' } }}
                  />
                  <div style={{ fontSize: 13, color: '#888', marginTop: -8 }}>
                    {ageRange[0]} tuổi - {ageRange[1]} tuổi
                  </div>
                </div>
                {/* Lọc giới tính */}
                <FormControl fullWidth>
                  <span style={{ fontSize: 13, color: '#888', fontWeight: 500 }}>Giới tính</span>
                  <Select value={gender} onChange={(e) => setGender(e.target.value)} size="small" displayEmpty sx={{ mt: 0.5 }}>
                    <MenuItem value="">Tất cả</MenuItem>
                    <MenuItem value="MALE">Nam</MenuItem>
                    <MenuItem value="FEMALE">Nữ</MenuItem>
                    <MenuItem value="OTHER">Khác</MenuItem>
                  </Select>
                </FormControl>
                {/* Lọc trạng thái */}
                <FormControl fullWidth>
                  <span style={{ fontSize: 13, color: '#888', fontWeight: 500 }}>Trạng thái</span>
                  <Select value={status} onChange={(e) => setStatus(e.target.value)} size="small" displayEmpty sx={{ mt: 0.5 }}>
                    <MenuItem value="">Tất cả</MenuItem>
                    <MenuItem value="ACTIVE">Đang làm</MenuItem>
                    <MenuItem value="INACTIVE">Nghỉ việc</MenuItem>
                  </Select>
                </FormControl>
                {/* Sắp xếp và Thứ tự nằm ngang */}
                <SoftBox display="flex" gap={2}>
                  <FormControl fullWidth>
                    <span style={{ fontSize: 13, color: '#888', fontWeight: 500 }}>Sắp xếp</span>
                    <Select value={sortBy} onChange={e => setSortBy(e.target.value)} size="small" sx={{ mt: 0.5 }}>
                      <MenuItem value="createdAt">Ngày tạo</MenuItem>
                      <MenuItem value="employeeName">Tên nhân viên</MenuItem>
                      <MenuItem value="birthDate">Ngày sinh</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <span style={{ fontSize: 13, color: '#888', fontWeight: 500 }}>Thứ tự</span>
                    <Select value={sortDir} onChange={e => setSortDir(e.target.value)} size="small" sx={{ mt: 0.5 }}>
                      <MenuItem value="desc">Giảm dần</MenuItem>
                      <MenuItem value="asc">Tăng dần</MenuItem>
                    </Select>
                  </FormControl>
                </SoftBox>
                <SoftBox display="flex" gap={1} mt={1}>
                  <Button
                    variant="contained"
                    color="info"
                    sx={{ background: "#49a3f1", color: "#fff", fontWeight: 500, borderRadius: 2, textTransform: "none", boxShadow: "none", flex: 1, '&:hover': { background: "#1769aa" } }}
                    onClick={() => setFilterAnchorEl(null)}
                  >
                    Ẩn lọc
                  </Button>
                  <Button
                    variant="outlined"
                    color="info"
                    sx={{ borderRadius: 2, textTransform: "none", color: "#49a3f1", borderColor: "#49a3f1", fontWeight: 500, flex: 1 }}
                    onClick={() => {
                      setGender(""); setStatus(""); setMinAge(""); setMaxAge(""); setSortBy("createdAt"); setSortDir("desc"); setAgeRange([18, 100]); setPage(1); setFilterAnchorEl(null);
                    }}
                  >
                    Đặt lại
                  </Button>
                </SoftBox>
              </SoftBox>
            </Popover>
            <Button variant="contained" color="success" startIcon={<FaPlus />} onClick={() => navigate("/NhanVien/ThemMoi")}
              sx={{ borderRadius: 2, textTransform: "none", fontWeight: 500, ml: 1 }}>
              Thêm nhân viên
            </Button>
          </SoftBox>
        </Card>
        {/* Table */}
        <Card>
          <div style={tableFontStyle}>
            <Table columns={columns} rows={rows} loading={loading} />
          </div>
        </Card>
        {/* Pagination giống SanPham */}
        <SoftBox display="flex" justifyContent="space-between" alignItems="center" mt={2} flexWrap="wrap" gap={2}>
          <SoftBox>
            <Button
              variant="outlined"
              size="small"
              sx={{ mr: 1, borderRadius: 2, textTransform: "none", color: "#49a3f1", borderColor: "#49a3f1" }}
              aria-haspopup="true"
              aria-controls="view-count-menu"
              onClick={(e) => setAnchorEl(e.currentTarget)}
            >
              Xem {pageSize} nhân viên
            </Button>
            <Menu
              anchorEl={anchorEl}
              id="view-count-menu"
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              MenuListProps={{ sx: { background: '#fff' } }}
              PaperProps={{ sx: { background: '#fff' } }}
            >
              {[5, 10, 20].map((n) => (
                <MenuItem
                  key={n}
                  onClick={() => {
                    setPageSize(n);
                    setPage(1);
                    setAnchorEl(null);
                  }}
                  sx={{ color: "#495057", background: '#fff' }}
                >
                  Xem {n} nhân viên
                </MenuItem>
              ))}
            </Menu>
          </SoftBox>
          <SoftBox display="flex" alignItems="center" gap={1}>
            <Button
              variant="text"
              size="small"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              sx={{ color: page === 1 ? "#bdbdbd" : "#49a3f1" }}
            >
              Trước
            </Button>
            {paginationItems.map((item, idx) =>
              item === "..." ? (
                <Button
                  key={`ellipsis-${idx}`}
                  variant="text"
                  size="small"
                  disabled
                  sx={{ minWidth: 32, borderRadius: 2, color: "#bdbdbd", pointerEvents: "none", fontWeight: 700 }}
                >
                  ...
                </Button>
              ) : (
                <Button
                  key={item}
                  variant={page === item ? "contained" : "text"}
                  color={page === item ? "info" : "inherit"}
                  size="small"
                  onClick={() => setPage(item)}
                  sx={{ minWidth: 32, borderRadius: 2, color: page === item ? "#fff" : "#495057", background: page === item ? "#49a3f1" : "#fff" }}
                >
                  {item}
                </Button>
              )
            )}
            <Button
              variant="text"
              size="small"
              disabled={page === totalPages || totalPages === 0}
              onClick={() => setPage(page + 1)}
              sx={{ color: page === totalPages ? "#bdbdbd" : "#49a3f1" }}
            >
              Sau
            </Button>
          </SoftBox>
        </SoftBox>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default NhanVienTable;