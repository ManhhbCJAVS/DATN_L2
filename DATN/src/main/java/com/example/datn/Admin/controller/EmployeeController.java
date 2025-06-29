package com.example.datn.Admin.controller;

import com.example.datn.Library.model.dto.request.StatusUpdateRequest;
import com.example.datn.Library.model.dto.request.employee.EmployeeCreateRequest;
import com.example.datn.Library.model.dto.request.employee.EmployeeFilterRequest;
import com.example.datn.Library.model.dto.request.employee.EmployeeUpdateRequest;
import com.example.datn.Library.model.dto.response.ResponseData;
import com.example.datn.Library.model.enums.Status;
import com.example.datn.Library.service.interfaces.EmployeeService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/admin/employee")
@RequiredArgsConstructor
@Validated
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EmployeeController {

    private static final Logger logger = LoggerFactory.getLogger(EmployeeController.class);
    EmployeeService employeeService;


    @PatchMapping("/{id}/status")
    public ResponseData<?> updateStatus(
            @PathVariable @Min(value = 1, message = "Invalid ID") Long id,
            @RequestBody @Valid StatusUpdateRequest statusUpdateRequest
            ) {
        return new ResponseData<>(HttpStatus.OK.value(),
                "Updated statsus employee status successfully",
                this.employeeService.updateStatus(id, statusUpdateRequest)
        );
    }
    @PatchMapping("/{id}")
    public ResponseData<?> updateEmployee(
            @Valid @RequestPart("employee") EmployeeUpdateRequest employeeUpdateRequest,
            @RequestPart(value = "imageFile", required = false) MultipartFile imageFile
    ) {
        logger.info("ImageFile "+ imageFile);
        logger.info("Updating employee with ID: {}, Request: {}", employeeUpdateRequest.getId(), employeeUpdateRequest);
        return new ResponseData<>(HttpStatus.OK.value(),
                "Updated employee successfully",
                this.employeeService.updateEmployee(employeeUpdateRequest , imageFile)
        );
    }


    //TODO: Data Format Validation
    @PostMapping(consumes = "multipart/form-data")
    public ResponseData<?> addEmployee(
            @Valid @RequestPart("employee") EmployeeCreateRequest employeeCreateRequest,
            @RequestPart(value = "imageFile", required = false) MultipartFile imageFile
    ) {
        logger.debug("employeeRequest: {}", employeeCreateRequest);
        return new ResponseData<>(HttpStatus.CREATED.value(),
                "Added employee successfully",
                this.employeeService.addEmployee(employeeCreateRequest, imageFile)
        );
    }

    @GetMapping("/{id}")
    public ResponseData<?> getEmployeeById(@PathVariable @Min(value = 1, message = "Invalid ID") Long id) {
        return new ResponseData<>(HttpStatus.OK.value(),
                "Retrieved employee successfully",
                this.employeeService.getEmployeeById(id)
        );
    }

    @GetMapping
    public ResponseData<?> getDataPage(
            @Valid @ModelAttribute EmployeeFilterRequest employeeFilterRequest
    ) {
        logger.info("EmployeeRequest: {}", employeeFilterRequest);
        return new ResponseData<>(HttpStatus.OK.value(),
                "Retrieved all employees successfully",
                this.employeeService.getPageData(employeeFilterRequest)
        );
    }
}
