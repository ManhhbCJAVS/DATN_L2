package com.example.datn.Library.model.dto.request.customer;

import com.example.datn.Library.model.dto.request.address.AddressRequest;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
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
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@ToString
public class CustomerCreateRequest {

    @Size(max = 50, message = "Tên nhân viên tối đa 50 ký tự")
    @NotBlank(message = "Tên nhân viên không được để trống")
    String customerName;
    @NotBlank(message = "Số điện thoại không được để trống")
    @Pattern(regexp = "^(03|05|07|08|09)[0-9]{8}$", message = "Số điện thoại phải có đúng 10 số và bắt đầu bằng 03, 05, 07, 08, hoặc 09")
    String phoneNumber;
    @Email(message = "Email không hợp lệ")
    @Pattern(regexp = "^[A-Za-z0-9+_.-]+@gmail\\.com$", message = "Email phải có định dạng @gmail.com")
    String email;
    LocalDate birthDate;
    String gender;
}
