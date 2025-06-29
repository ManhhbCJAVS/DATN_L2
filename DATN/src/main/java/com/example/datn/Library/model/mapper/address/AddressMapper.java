package com.example.datn.Library.model.mapper.address;

import com.example.datn.Library.model.dto.request.address.AddressRequest;
import com.example.datn.Library.model.dto.request.address.UpdateAddressRequest;
import com.example.datn.Library.model.dto.response.address.AddressCustomerResponse;
import com.example.datn.Library.model.entity.adress.Address;
import com.example.datn.Library.model.entity.customer.Customer;
import org.mapstruct.IterableMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;

import java.util.ArrayList;
import java.util.List;


@Mapper(componentModel = "spring")
public interface AddressMapper {

    AddressCustomerResponse toAddressCustomerResponse(Address address);

    @Mapping(source = "customerId", target = "customer.id")
    Address toAddress(UpdateAddressRequest updateAddressRequest);

    @Named("toAddress")
    @Mapping(source = "customerId", target = "customer.id")
    Address toAddress(AddressRequest addressRequest);
    @IterableMapping(qualifiedByName = "toAddress")
    ArrayList<Address> toAddressList(List<AddressRequest> addressRequests);
    @Named("toAddressWithCustomer")
    @Mapping(source = "addressRequest.city", target = "city")
    @Mapping(source = "addressRequest.district", target = "district")
    @Mapping(source = "addressRequest.ward", target = "ward")
    @Mapping(source = "addressRequest.street", target = "street")
    @Mapping(source = "addressRequest.status", target = "status")
    @Mapping(source = "customer", target = "customer")
    @Mapping(target = "id", ignore = true) // Bỏ ánh xạ id
    @Mapping(target = "createdAt", ignore = true) // Bỏ ánh xạ createdAt
    @Mapping(target = "updatedAt", ignore = true) // Bỏ ánh xạ updatedAt
    Address toAddressWithCustomer(AddressRequest addressRequest, Customer customer);

    //TODO: Address bổ sung customer (CustomerID) when save.
    default ArrayList<Address> toAddressListWithCustomer(List<AddressRequest> addressRequests, Customer customer){
         ArrayList<Address> addressList = new ArrayList<>();
         if (addressRequests != null && customer != null) {
             for (AddressRequest request : addressRequests) {
                 addressList.add(toAddressWithCustomer(request, customer));
             }
         }
         return addressList;
     }
}
