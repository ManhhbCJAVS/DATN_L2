package com.example.datn.Library.model.dto.request.address;

import com.example.datn.Library.model.enums.Status;
import com.example.datn.Library.validation.EnumSubset;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@ToString
public class AddressRequest {

    Integer customerId;

    @NotBlank(message = "Tỉnh/Thành phố không được để trống")
    @Size(max = 100, message = "Tỉnh/Thành phố tối đa 100 ký tự")
    String city;
    @NotBlank(message = "Xã/Phường không được để trống")
    @Size(max = 100, message = "Xã/Phường tối đa 100 ký tự")
    String district;

    @NotBlank(message = "Xã/Phường không được để trống")
    @Size(max = 100, message = "Xã/Phường tối đa 100 ký tự")
    String ward;
    @NotBlank(message = "Số nhà/Ngõ/Đường không được để trống")
    @Size(max = 255, message = "Số nhà/Ngõ/Đường tối đa 255 ký tự")
    String street;

    //TODO: Có thể null nếu addressReq k có status. || DEFAULT cho employee.
    @EnumSubset(enumClass = Status.class, anyOf = {"DEFAULT"})
    String status;

    @Override
    public String toString() {
        return "AddressEmployeeRequest{" +
                "customerId=" + customerId +
                "city='" + city + '\'' +
                ", district='" + district + '\'' +
                ", ward='" + ward + '\'' +
                ", street='" + street + '\'' +
                ", status='" + status + '\'' +
                '}';
    }
}
