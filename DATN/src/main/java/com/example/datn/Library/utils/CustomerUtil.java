package com.example.datn.Library.utils;

import com.example.datn.Library.repository.customer.CustomerRepository;
import com.example.datn.Library.repository.employee.EmployeeRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Component
public class CustomerUtil {
    final CustomerRepository customerRepository;

    public  String generateCustomerCode() {
        long count = customerRepository.count() + 1; // Tăng thêm 1 để lấy mã cho nhân viên mới
        if(count < 10) {
            return String.format("CUS-0%d", count);
        } else {
            return String.format("CUS-%d", count);
        }
    }
}
