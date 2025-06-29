package com.example.datn.Library.utils;

import com.example.datn.Library.repository.employee.EmployeeRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Component
public class EmployeeUtil {
    final EmployeeRepository employeeRepository;

    public  String generateEmployeeCode() {
        long count = employeeRepository.count() + 1; // Tăng thêm 1 để lấy mã cho nhân viên mới
        if(count < 10) {
            return String.format("EMP-0%d", count);
        } else {
            return String.format("EMP-%d", count);
        }
    }
}
