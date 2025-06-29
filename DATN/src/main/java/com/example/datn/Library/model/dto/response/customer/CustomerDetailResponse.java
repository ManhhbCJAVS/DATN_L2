package com.example.datn.Library.model.dto.response.customer;

import com.example.datn.Library.model.dto.response.address.AddressCustomerResponse;
import com.example.datn.Library.model.dto.response.image.ImageResponse;
import com.example.datn.Library.model.entity.adress.Address;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CustomerDetailResponse {

    Integer id;
    ImageResponse imageResponse;
    String customerCode;
    String customerName;
    LocalDate birthDate;
    String phoneNumber;
    String email;
    String gender;
    String status;
    List<AddressCustomerResponse> addressCustomerResponses;

    @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss")
    LocalDateTime createdAt;
    @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss")
    LocalDateTime updatedAt;

    @Override
    public String toString() {
        return "CustomerDetailResponse{" +
                "id=" + id +
                ", imageResponse=" + imageResponse +
                ", customerCode='" + customerCode + '\'' +
                ", customerName='" + customerName + '\'' +
                ", birthDate=" + birthDate +
                ", phoneNumber='" + phoneNumber + '\'' +
                ", email='" + email + '\'' +
                ", gender='" + gender + '\'' +
                ", status='" + status + '\'' +
                ", addressCustomerResponses=" + addressCustomerResponses +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
}
