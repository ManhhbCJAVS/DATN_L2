package com.example.datn.Library.service.interfaces;

import com.example.datn.Library.model.dto.request.address.AddressRequest;
import com.example.datn.Library.model.dto.request.address.UpdateAddressRequest;
import com.example.datn.Library.model.dto.response.address.AddressCustomerResponse;

public interface AddressService {

     AddressCustomerResponse addAddress(AddressRequest addressRequest);
     AddressCustomerResponse updateAddress(UpdateAddressRequest updateAddressRequest);

     AddressCustomerResponse deleteAddress(Long id);
}
