import React from "react";
import PropTypes from "prop-types";
import SoftBox from "components/SoftBox";

function DiaChiNhanVien({ addressResponse }) {
  if (!addressResponse) return null;
  const { city, district, ward, street } = addressResponse;
  return (
    <SoftBox mb={2} style={{ border: '1px solid #e0e0e0', borderRadius: 8, padding: 16, background: '#fafbfc' }}>
      <div style={{ fontWeight: 600, color: '#222', fontSize: 15, marginBottom: 2 }}>
        Địa chỉ nhân viên
      </div>
      <div style={{ fontSize: 15, color: '#222', marginBottom: 2 }}>
        {city ? `Tỉnh ${city}` : ''}
        {district ? `, Huyện ${district}` : ''}
        {ward ? `, Xã ${ward}` : ''}
      </div>
      <div style={{ fontSize: 14, color: '#888', marginTop: 1 }}>
        {street || ''}
      </div>
    </SoftBox>
  );
}

DiaChiNhanVien.propTypes = {
  addressResponse: PropTypes.shape({
    city: PropTypes.string,
    district: PropTypes.string,
    ward: PropTypes.string,
    street: PropTypes.string,
  }),
};

export default DiaChiNhanVien;
