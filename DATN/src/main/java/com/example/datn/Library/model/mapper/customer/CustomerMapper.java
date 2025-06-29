package com.example.datn.Library.model.mapper.customer;

import com.example.datn.Library.model.dto.request.customer.CustomerCreateRequest;
import com.example.datn.Library.model.dto.request.customer.CustomerUpdateRequest;
import com.example.datn.Library.model.dto.response.address.AddressCustomerResponse;
import com.example.datn.Library.model.dto.response.customer.CustomerDetailResponse;
import com.example.datn.Library.model.dto.response.customer.CustomerResponse;
import com.example.datn.Library.model.entity.adress.Address;
import com.example.datn.Library.model.entity.customer.Customer;
import com.example.datn.Library.model.enums.Status;
import com.example.datn.Library.model.mapper.address.AddressMapper;
import org.mapstruct.IterableMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@Mapper(componentModel = "spring", uses = {AddressMapper.class})
public abstract class CustomerMapper {

    @Autowired
    protected AddressMapper addressMapper;

    public abstract void updateCustomerFromRequest(CustomerUpdateRequest request, @MappingTarget Customer customer);

    public abstract Customer toCustomer(CustomerCreateRequest customerCreateRequest);

    @Named("toCustomerResponse")
    @Mapping(target = "defaultAddress", source = "addresses", qualifiedByName = "mapDefaultAddress")
    @Mapping(source = "image", target = "imageResponse")
     public abstract CustomerResponse toCustomerResponse(Customer customer);

    @IterableMapping(qualifiedByName = "toCustomerResponse")
    public abstract List<CustomerResponse> toCustomerResponseList(List<Customer> customers);


    @Mapping(source = "image", target = "imageResponse")
    @Mapping(source = "addresses", target = "addressCustomerResponses")
    public abstract CustomerDetailResponse toCustomerDetailResponse(Customer customer);

    @Named("mapDefaultAddress")
    protected AddressCustomerResponse mapDefaultAddress(List<Address> addresses) {
        if (addresses == null || addresses.isEmpty()) {
            return null;
        }
        return addresses.stream()
                .filter(address -> Status.DEFAULT.equals(address.getStatus()))
                .findFirst()
                .map(addressMapper::toAddressCustomerResponse)//TODO: Trả về AddressCustomerResponse.
                .orElse(null);
    }
}
