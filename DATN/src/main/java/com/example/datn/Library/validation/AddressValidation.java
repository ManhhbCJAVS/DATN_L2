package com.example.datn.Library.validation;

import com.example.datn.Library.model.dto.request.address.AddressRequest;
import com.example.datn.Library.model.entity.adress.Address;
import com.example.datn.Library.repository.address.AddressRepository;
import com.example.datn.Library.repository.customer.CustomerRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Component;

import java.util.List;

@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Component
public class AddressValidation {

    final AddressRepository addressRepository;

    public void validateCreateAddress(AddressRequest addressRequest) {
        List<Address> addresses = addressRepository.getAddressesByCustomerId(addressRequest.getCustomerId());

        for (Address address : addresses) {
            if (isSameAddress(address, addressRequest)) {
                throw new IllegalArgumentException("Địa chỉ này đã tồn tại: " + formatAddress(addressRequest));
            }
        }
    }

    private boolean isSameAddress(Address address, AddressRequest request) {
        return equalsIgnoreCaseAndTrim(address.getCity(), request.getCity()) &&
                equalsIgnoreCaseAndTrim(address.getDistrict(), request.getDistrict()) &&
                equalsIgnoreCaseAndTrim(address.getWard(), request.getWard()) &&
                equalsIgnoreCaseAndTrim(address.getStreet(), request.getStreet());
    }


    private boolean equalsIgnoreCaseAndTrim(String s1, String s2) {
        if (s1 == null || s2 == null) return false;
        return s1.trim().equalsIgnoreCase(s2.trim());
    }

    private String formatAddress(AddressRequest request) {
        return String.format("%s, %s, %s, %s",
                request.getStreet(),
                request.getWard(),
                request.getDistrict(),
                request.getCity()
        );
    }


}
