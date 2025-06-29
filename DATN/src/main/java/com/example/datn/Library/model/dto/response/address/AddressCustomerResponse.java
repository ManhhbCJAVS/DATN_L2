package com.example.datn.Library.model.dto.response.address;

import com.example.datn.Library.model.entity.adress.Address;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
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
@Builder
@ToString
public class AddressCustomerResponse  {

    Integer id;
    String city;
    String district;
    String ward;
    String street;

    String status;

    @Override
    public String toString() {
        return "AddressCustomerResponse{" +
                "id=" + id +
                ", city='" + city + '\'' +
                ", district='" + district + '\'' +
                ", ward='" + ward + '\'' +
                ", street='" + street + '\'' +
                ", status='" + status + '\'' +
                '}';
    }
}
