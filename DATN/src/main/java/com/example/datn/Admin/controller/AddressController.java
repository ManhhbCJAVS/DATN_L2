package com.example.datn.Admin.controller;

import com.example.datn.Library.model.dto.request.address.AddressRequest;
import com.example.datn.Library.model.dto.request.address.UpdateAddressRequest;
import com.example.datn.Library.model.dto.response.ResponseData;
import com.example.datn.Library.service.interfaces.AddressService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin/address")
@RequiredArgsConstructor
@Validated
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AddressController {
    private static final Logger logger = LoggerFactory.getLogger(CustomerController.class);
    AddressService addressService;
    @PostMapping
    public ResponseData<?> addAddress(@ModelAttribute AddressRequest addressRequest) {
        logger.info("Adding address with  Request: {}",  addressRequest);
        return new ResponseData<>(HttpStatus.OK.value(),
                "Added address successfully",
                this.addressService.addAddress(addressRequest)
        );
    }
    @PatchMapping("/{id}")
    public ResponseData<?> updateAddress(@ModelAttribute UpdateAddressRequest updateAddressRequest) {
        logger.info("Updating address with ID: {}, Request: {}", updateAddressRequest.getId(), updateAddressRequest);
        return new ResponseData<>(HttpStatus.OK.value(),
                "Updated address successfully",
                this.addressService.updateAddress(updateAddressRequest)
        );
    }
    @DeleteMapping("/{id}")
    public ResponseData<?> deleteAddress(@PathVariable Long id) {
        logger.info("Deleting address with ID: {}", id);
        return new ResponseData<>(HttpStatus.OK.value(),
                "Deleted address successfully",
                this.addressService.deleteAddress(id)
        );
    }
}
