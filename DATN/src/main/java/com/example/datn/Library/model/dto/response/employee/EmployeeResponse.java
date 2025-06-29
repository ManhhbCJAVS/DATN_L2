package com.example.datn.Library.model.dto.response.employee;


import com.example.datn.Library.model.dto.response.address.AddressEmployeeResponse;
import com.example.datn.Library.model.dto.response.image.ImageResponse;
import com.example.datn.Library.model.entity.Image;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EmployeeResponse {
    //Employee Overview: id, ảnh, mã, tên/email, vai trò, sđt, địa chỉ, gender, trạng thái,
        // Địa chỉ = Tỉnh/Thành Phố + Quận/huyện + Xã/Phường + Số nhà/ngõ/đường.

    //Employee Detail: hiển thị thêm các trường psw, citizenId, birthDate, createAt, updateAt.
    Integer id;
    ImageResponse imageResponse;
    String employeeCode;
    String employeeName;
    String email;
    String role;
    String phoneNumber;

    AddressEmployeeResponse addressResponse;
    String gender;
    String status;


}
