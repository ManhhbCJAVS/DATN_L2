package com.example.datn.Library.service.impl;

import com.example.datn.Library.exception.ResourceNotFoundException;
import com.example.datn.Library.model.dto.request.address.AddressRequest;
import com.example.datn.Library.model.dto.request.address.UpdateAddressRequest;
import com.example.datn.Library.model.dto.response.address.AddressCustomerResponse;
import com.example.datn.Library.model.entity.adress.Address;
import com.example.datn.Library.model.mapper.address.AddressMapper;
import com.example.datn.Library.repository.address.AddressRepository;
import com.example.datn.Library.service.interfaces.AddressService;
import com.example.datn.Library.validation.AddressValidation;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AddressServiceImpl implements AddressService {

    final Logger logger = LoggerFactory.getLogger(AddressServiceImpl.class);
    final AddressMapper addressMapper;
    final AddressRepository addressRepository;
    final AddressValidation addressValidation;

    @Transactional
    @Override
    public AddressCustomerResponse deleteAddress(Long id) {
        Address address = addressRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found with ID: " + id));
        addressRepository.delete(address);
        return null;
    }

    @Transactional
    @Override
    public AddressCustomerResponse updateAddress(UpdateAddressRequest updateAddressRequest) {
        Address address = addressMapper.toAddress(updateAddressRequest);
        if("DEFAULT".equals(updateAddressRequest.getStatus())) {
            updateStatusForAddressesByCustomerId(updateAddressRequest.getCustomerId());
        }
        logger.debug("Update address: {}", address);
        addressRepository.save(address);
        return addressMapper.toAddressCustomerResponse(address);
    }


    @Transactional
    @Override
    public AddressCustomerResponse addAddress(AddressRequest addressRequest) {
        addressValidation.validateCreateAddress(addressRequest);//TODO: Check duplicate address.
        if ("DEFAULT".equals(addressRequest.getStatus())) {
            updateStatusForAddressesByCustomerId(addressRequest.getCustomerId());
        }
        Address address = addressMapper.toAddress(addressRequest);
        addressRepository.save(address);
        return addressMapper.toAddressCustomerResponse(address);
    }

    private void updateStatusForAddressesByCustomerId(Integer customerId) {
        List<Address> addresses = addressRepository.getAddressesByCustomerId(customerId);
        if (addresses != null && !addresses.isEmpty()) {
            addresses.forEach(address -> address.setStatus(null));
            addressRepository.saveAll(addresses);
        }
    }
}
