package com.example.datn.Library.model.dto.request.employee;


import com.example.datn.Library.model.dto.request.address.AddressRequest;
import com.example.datn.Library.model.enums.Gender;
import com.example.datn.Library.model.enums.Role;
import com.example.datn.Library.validation.EnumSubset;
import jakarta.validation.Valid;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@ToString
public class EmployeeCreateRequest {

    // Tên + CCCD + Email + Ngày sinh + Gioi tinh + Sđt + Trảng thái
    // Địa chỉ = Tỉnh/Thành Phố + Quận/huyện + Xã/Phường + Số nhà/ngõ/đường.
    @Size(max = 50, message = "Tên nhân viên tối đa 50 ký tự")
    @NotBlank(message = "Tên nhân viên không được để trống")
    String employeeName;
    @Size(max = 12, min = 12, message = "CCCD phải có đúng 12 ký tự")
    @NotBlank(message = "CCCD không được để trống")
    String citizenId;

    //@Email(message = "Email không hợp lệ")
    //@Pattern(regexp = "^[A-Za-z0-9+_.-]+@gmail\\.com$", message = "Email phải có định dạng @gmail.com")
    String email;

    @NotNull(message = "Ngày sinh không được để trống")
    @Past(message = "Ngày sinh phải là ngày trong quá khứ")
    LocalDate birthDate;

    @AssertTrue(message = "Độ tuổi phải nhỏ hơn 100")
    boolean isBirthDateValid() {
        if (birthDate == null) {
            return false;
        }
        LocalDate maxDate = LocalDate.now().minusYears(100);
        return birthDate.isAfter(maxDate);
    }

    @NotBlank(message = "Giới tính không được để trống")
    @EnumSubset(enumClass = Gender.class, anyOf = {"MALE", "FEMALE"})
    String gender;

    @NotBlank(message = "Số điện thoại không được để trống")
    @Pattern(regexp = "^(03|05|07|08|09)[0-9]{8}$", message = "Số điện thoại phải có đúng 10 số và bắt đầu bằng 03, 05, 07, 08, hoặc 09")
    String phoneNumber;

    @NotNull(message = "Chức vụ không được để trống")
    @EnumSubset(enumClass = Role.class, anyOf = {"ADMIN", "EMPLOYEE"})
    String role;

    @Valid // Đảm bảo validation được áp dụng cho các trường trong AddressEmployeeRequest
    AddressRequest address;

    @Override
    public String toString() {
        return "EmployeeCreateRequest{" +
                "employeeName='" + employeeName + '\'' +
                ", citizenId='" + citizenId + '\'' +
                ", email='" + email + '\'' +
                ", birthDate=" + birthDate +
                ", gender='" + gender + '\'' +
                ", phoneNumber='" + phoneNumber + '\'' +
                ", role='" + role + '\'' +
                ", address=" + address +
                '}';
    }
}
