package com.example.datn.Library.model.mapper.employee;

import com.example.datn.Library.model.dto.request.employee.EmployeeCreateRequest;
import com.example.datn.Library.model.dto.request.employee.EmployeeUpdateRequest;
import com.example.datn.Library.model.dto.response.employee.EmployeeDetailResponse;
import com.example.datn.Library.model.dto.response.employee.EmployeeResponse;
import com.example.datn.Library.model.entity.employee.Employee;
import org.mapstruct.IterableMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;

import java.util.List;
@Mapper(componentModel = "spring")
public interface EmployeeMapper {


    @Named("toEmployeeResponseOnly")
    @Mapping(source = "role", target = "role")
    @Mapping(source = "gender", target = "gender")
    @Mapping(source = "status", target = "status")
    @Mapping( source = "address" , target = "addressResponse")
    @Mapping(source = "image", target = "imageResponse")
    EmployeeResponse toEmployeeResponse(Employee employee);

    @IterableMapping(qualifiedByName = "toEmployeeResponseOnly")
    @Mapping(source = "image", target = "imageResponse")
    @Mapping(source = "address", target = "addressResponse")
    List<EmployeeResponse> toEmployeeResponseList(List<Employee> employees);

    @Mapping(source = "image", target = "imageResponse")
    @Mapping(source = "address", target = "addressResponse")
    EmployeeDetailResponse toEmployeeDetailResponse(Employee employee);

    // THÊM MỚI: Chuyển từ DTO Request -> Entity
    @Mapping(source = "employeeName", target = "employeeName")
    @Mapping(source = "citizenId", target = "citizenId")
    @Mapping(source = "email", target = "email")
    @Mapping(source = "birthDate", target = "birthDate")
    @Mapping(source = "gender", target = "gender")
    @Mapping(source = "phoneNumber", target = "phoneNumber")
    @Mapping(source = "address", target = "address")
    @Mapping(source = "role", target="role")
    Employee toEmployee(EmployeeCreateRequest employeeCreateRequest);

    // Mới: Cập nhật Employee từ EmployeeUpdateRequest
    @Mapping(source = "employeeName", target = "employeeName")
    @Mapping(source = "citizenId", target = "citizenId")
    @Mapping(source = "email", target = "email")
    @Mapping(source = "birthDate", target = "birthDate")
    @Mapping(source = "gender", target = "gender")
    @Mapping(source = "phoneNumber", target = "phoneNumber")
    @Mapping(source = "role", target = "role")
    @Mapping(source = "address", target = "address")
    @Mapping(source = "status", target = "status")
    void updateEmployeeFromRequest(EmployeeUpdateRequest request,@MappingTarget Employee employee);
}
