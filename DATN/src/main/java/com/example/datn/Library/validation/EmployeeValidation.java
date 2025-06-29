package com.example.datn.Library.validation;

import com.example.datn.Library.model.dto.request.employee.EmployeeCreateRequest;
import com.example.datn.Library.repository.employee.EmployeeRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Component
public class EmployeeValidation {

    final EmployeeRepository employeeRepository;

     public void  validateCreateEmployee(EmployeeCreateRequest EmployeeCreateRequest) {
        if (employeeRepository.existsByCitizenId(EmployeeCreateRequest.getCitizenId())) {
            throw new IllegalArgumentException("CCCD đã tồn tại " + EmployeeCreateRequest.getCitizenId());
        }
        if (employeeRepository.existsByEmail(EmployeeCreateRequest.getEmail())) {
            throw new IllegalArgumentException("Email đã tồn tại: " + EmployeeCreateRequest.getEmail());
        }
        if (employeeRepository.existsByPhoneNumber(EmployeeCreateRequest.getPhoneNumber())) {
            throw new IllegalArgumentException("Số điện thoại đã tồn tại: " + EmployeeCreateRequest.getPhoneNumber());
        }
    }

}
