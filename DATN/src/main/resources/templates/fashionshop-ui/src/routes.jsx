import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";
import Billing from "layouts/billing";
import SanPham from "layouts/SanPham/sanphan";
import ThuongHieu from "layouts/SanPham/thuonghieu";
import ChatLieu from "layouts/SanPham/chatlieu";
import DanhMuc from "layouts/SanPham/danhmuc";
import KichThuoc from "layouts/SanPham/kichthuoc";
import MauSac from "layouts/SanPham/mausac";
import TayAo from "layouts/SanPham/tayao";
import CoAo from "layouts/SanPham/coao";
import HinhAnh from "layouts/SanPham/hinhanh";
import ProductForm from "layouts/SanPham/themsp";

import NhanVien from "layouts/NhanVien/nhanvien";
import NhanVienChiTiet from "layouts/NhanVien/NhanVienChiTiet";
import ThemNhanVien from "layouts/NhanVien/ThemNhanVien";
import CapNhatNhanVien from "layouts/NhanVien/CapNhatNhanVien";

import RTL from "layouts/rtl";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import KhachHang from "layouts/KhachHang/khachhang";
import CustomerDetailsPage from "layouts/KhachHang/CustomerDetailsPage";
import KhachHangChiTiet from "layouts/KhachHang/KhachHangChiTiet";
import ThemKhachHang from "layouts/KhachHang/ThemKhachHang";
import CapNhatKhachHang from "layouts/KhachHang/CapNhatKhachHang";

// Soft UI Dashboard React icons
import Shop from "examples/Icons/Shop";
import Office from "examples/Icons/Office";
import Settings from "examples/Icons/Settings";
import Document from "examples/Icons/Document";
import SpaceShip from "examples/Icons/SpaceShip";
import CustomerSupport from "examples/Icons/CustomerSupport";
import CreditCard from "examples/Icons/CreditCard";
import Cube from "examples/Icons/Cube";

const routes = [
  {
    type: "collapse",
    name: "Thống Kê",
    key: "dashboard",
    route: "/dashboard",
    icon: <Shop size="12px" />,
    component: <Dashboard />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Bán Hàng Tại Quầy",
    key: "tables",
    route: "/tables",
    icon: <Office size="12px" />,
    component: <Tables />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Quản Lý Hóa Đơn",
    key: "billing",
    route: "/billing",
    icon: <CreditCard size="12px" />,
    component: <Billing />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Quản Lý Sản Phẩm",
    key: "virtual-reality",
    icon: <Cube size="12px" />,
    // Không dùng route + component khi có menu con!
    collapse: [
      {
        type: "item",
        name: "Sản Phẩm",
        key: "product-list",
        route: "/SanPham", 
        component: <SanPham />,
        noCollapse: true,
      },
      {
        type: "item",
        name: "Thương Hiệu",
        key: "product-category",
        route: "/Brand",  
        component: <ThuongHieu />,
        noCollapse: true,
      },
      {
        type: "item",
        name: "Chất Liệu",
        key: "material",
        route: "/material",
        component: <ChatLieu />,
        noCollapse: true,
      },
      {
        type: "item",
        name: "Danh Mục",
        key: "category",
        route: "/category",
        component: <DanhMuc />,
        noCollapse: true,
      },
      {
        type: "item",
        name: "Kích Thước",
        key: "size",
        route: "/size",
        component: <KichThuoc />,
        noCollapse: true,
      },
      {
        type: "item",
        name: "Màu Sắc",
        key: "color",
        route: "/color",
        component: <MauSac />,
        noCollapse: true,
      },
      {
        type: "item",
        name: "Tay Áo",
        key: "sleeve",
        route: "/sleeve",
        component: <TayAo />,
        noCollapse: true,
      },
      {
        type: "item",
        name: "Cổ Áo",
        key: "colar",
        route: "/colar", 
        component: <CoAo />,
        noCollapse: true,
      },
      {
        type: "item",
        name: "Hình Ảnh",
        key: "image",
        route: "/image",
        component: <HinhAnh />,
        noCollapse: true,
      },
    ],
  },
  {
    type: "collapse",
    name: "Giảm Giá",
    key: "rtl",
    icon: <Settings size="12px" />,
    collapse: [
      {
        type: "item",
        name: "Danh Sách Giảm Giá",
        key: "discount-list",
        route: "/rtl",   // dùng tạm route cha
      },
      {
        type: "item",
        name: "Lịch Sử Giảm Giá",
        key: "discount-history",
        route: "/rtl",   // dùng tạm route cha
      },
    ],
  },
  {
    type: "collapse",
    name: "Quản lý Nhân Viên",
    key: "nhanvien",
    route: "/nhanvien",
    icon: <Office size="12px" />,
    component: <NhanVien />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Quản lý Khách Hàng",
    key: "khachhang",
    route: "/khachhang",
    icon: <Office size="12px" />,
    component: <KhachHang />,
    noCollapse: true,
  },
  { type: "title", title: "Account Pages", key: "account-pages" },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    route: "/profile",
    icon: <CustomerSupport size="12px" />,
    component: <Profile />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Sign In",
    key: "sign-in",
    route: "/authentication/sign-in",
    icon: <Document size="12px" />,
    component: <SignIn />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Sign Up",
    key: "sign-up",
    route: "/authentication/sign-up",
    icon: <SpaceShip size="12px" />,
    component: <SignUp />,
    noCollapse: true,
  },
  {
        type: "item",
        name: "Thêm Sản Phẩm",
        key: "add-product",
        route: "/SanPham/ThemMoi",
        component: <ProductForm />,
        noCollapse: true,
        hidden: true, // ẩn khỏi menu nếu muốn
      },
  {
        type: "item",
        name: "Chi tiết nhân viên",
        key: "nhanvien-detail",
        route: "/NhanVien/ChiTiet/:id",
        component: <NhanVienChiTiet />,
        noCollapse: true,
        hidden: true,
      },
  {
    type: "route",
    name: "Thêm Nhân Viên",
    key: "them-nhan-vien",
    route: "/NhanVien/ThemMoi",
    component: <ThemNhanVien />,
    noCollapse: true,
    hidden: true,
  },
  {
    type: "route",
    name: "Cập nhật nhân viên",
    key: "capnhat-nhan-vien",
    route: "/NhanVien/CapNhat/:id",
    component: <CapNhatNhanVien />,
    noCollapse: true,
    hidden: true,
  },
  {
    type: "route",
    name: "Chi tiết khách hàng",
    key: "khachhang-detail",
    route: "/khachhang/chitiet/:customerId",
    component: <KhachHangChiTiet />,
    noCollapse: true,
    hidden: true,
  },
  {
    type: "route",
    name: "Thêm khách hàng",
    key: "khachhang-them",
    route: "/khachhang/themmoi",
    component: <ThemKhachHang />,
    noCollapse: true,
    hidden: true,
  },
  {
    type: "route",
    name: "Cập nhật khách hàng",
    key: "capnhat-khachhang",
    route: "/khachhang/capnhat/:customerId",
    component: <CapNhatKhachHang />,
    noCollapse: true,
    hidden: true,
  },
];

export default routes;