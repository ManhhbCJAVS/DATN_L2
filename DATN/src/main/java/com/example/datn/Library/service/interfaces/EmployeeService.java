package com.example.datn.Library.service.interfaces;

import com.example.datn.Library.model.dto.request.StatusUpdateRequest;
import com.example.datn.Library.model.dto.request.employee.EmployeeCreateRequest;
import com.example.datn.Library.model.dto.request.employee.EmployeeFilterRequest;
import com.example.datn.Library.model.dto.request.employee.EmployeeUpdateRequest;
import com.example.datn.Library.model.dto.response.PageableResponse;
import com.example.datn.Library.model.dto.response.employee.EmployeeDetailResponse;
import com.example.datn.Library.model.dto.response.employee.EmployeeResponse;
import com.example.datn.Library.model.enums.Status;
import org.springframework.web.multipart.MultipartFile;

public interface EmployeeService {
    PageableResponse getPageData( EmployeeFilterRequest employeeParamFilter);

    EmployeeDetailResponse getEmployeeById(Long id);

    EmployeeDetailResponse addEmployee(EmployeeCreateRequest employeeCreateRequest , MultipartFile imageFile);

    EmployeeDetailResponse updateEmployee(EmployeeUpdateRequest employeeUpdateRequest, MultipartFile imageFile);

    EmployeeDetailResponse updateStatus(Long id, StatusUpdateRequest statusUpdateRequest);
}
