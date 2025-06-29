package com.example.datn.Library.model.dto.response.customer;

import com.example.datn.Library.model.dto.response.address.AddressCustomerResponse;
import com.example.datn.Library.model.dto.response.address.AddressEmployeeResponse;
import com.example.datn.Library.model.dto.response.image.ImageResponse;
import com.example.datn.Library.model.entity.adress.Address;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CustomerResponse   {

    Integer id;
    ImageResponse imageResponse;
    String customerCode;
    String customerName;
    String email;
    LocalDate birthDate;
    String phoneNumber;

    String gender;

    String status;
    AddressCustomerResponse defaultAddress;
    @Override
    public String toString() { // TODO:  toString
        return "CustomerResponse{" +
                "id=" + id +
                ", imageResponse=" + imageResponse +
                ", customerCode='" + customerCode + '\'' +
                ", customerName='" + customerName + '\'' +
                ", birthDate=" + birthDate +
                ", phoneNumber='" + phoneNumber + '\'' +
                ", email='" + email + '\'' +
                ", gender='" + gender + '\'' +
                ", status='" + status + '\'' +
                ", defaultAddress=" + defaultAddress +
                '}';
    }

}
