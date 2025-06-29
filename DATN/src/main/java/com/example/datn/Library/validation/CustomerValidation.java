package com.example.datn.Library.validation;

import com.example.datn.Library.model.dto.request.customer.CustomerCreateRequest;
import com.example.datn.Library.model.dto.request.employee.EmployeeCreateRequest;
import com.example.datn.Library.repository.customer.CustomerRepository;
import com.example.datn.Library.repository.employee.EmployeeRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Component
public class CustomerValidation {
    final CustomerRepository customerRepository;
     public void  validateCreateCustomer(CustomerCreateRequest customerCreateRequest) {
         //TODO: Not duplicate email or phoneNumber
        if (customerRepository.existsByEmail(customerCreateRequest.getEmail())) {
            throw new IllegalArgumentException("Email đã tồn tại: " + customerCreateRequest.getEmail());
        }
        if (customerRepository.existsByPhoneNumber(customerCreateRequest.getPhoneNumber())) {
            throw new IllegalArgumentException("Số điện thoại đã tồn tại: " + customerCreateRequest.getPhoneNumber());
        }
    }

}
