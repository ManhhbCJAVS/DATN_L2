package com.example.datn.Admin.controller;

import com.example.datn.Library.model.dto.request.StatusUpdateRequest;
import com.example.datn.Library.model.dto.request.address.AddressRequest;
import com.example.datn.Library.model.dto.request.customer.CustomerCreateRequest;
import com.example.datn.Library.model.dto.request.customer.CustomerFilterRequest;
import com.example.datn.Library.model.dto.request.customer.CustomerUpdateRequest;
import com.example.datn.Library.model.dto.request.employee.EmployeeCreateRequest;
import com.example.datn.Library.model.dto.request.employee.EmployeeFilterRequest;
import com.example.datn.Library.model.dto.request.employee.EmployeeUpdateRequest;
import com.example.datn.Library.model.dto.response.ResponseData;
import com.example.datn.Library.service.interfaces.CustomerService;
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

import java.util.List;

@RestController
@RequestMapping("/admin/customer")
@RequiredArgsConstructor
@Validated
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CustomerController {

    private static final Logger logger = LoggerFactory.getLogger(CustomerController.class);
    CustomerService customerService;

    @PatchMapping("/{id}/status")
    public ResponseData<?> updateStatus(
            @PathVariable @Min(value = 1, message = "Invalid ID") Long id,
            @RequestBody @Valid StatusUpdateRequest statusUpdateRequest
    ) {
        return new ResponseData<>(HttpStatus.OK.value(),
                "Updated status customer status successfully",
                this.customerService.updateStatus(id, statusUpdateRequest)
        );
    }

    @PatchMapping("/{id}")
    public ResponseData<?> updateCustomer(
            @Valid @RequestPart("CustomerUpdateRequest") CustomerUpdateRequest customerUpdateRequest,
            @RequestPart(value = "imageFile", required = false) MultipartFile imageFile
    ) {
        logger.info("ImageFile "+ imageFile);
        logger.info("Updating employee with ID: {}, Request: {}", customerUpdateRequest.getId(), customerUpdateRequest);
        return new ResponseData<>(HttpStatus.OK.value(),
                "Updated employee successfully",
                this.customerService.updateCustomer(customerUpdateRequest , imageFile)
        );
    }

    @PostMapping(consumes = "multipart/form-data")
    public ResponseData<?> addCustomer(
            @Valid @RequestPart("customerCreateRequest") CustomerCreateRequest customerCreateRequest,
            @Valid @RequestPart(value = "addressesRequest" , required = false) List<AddressRequest> addressesRequest,
            @RequestPart(value = "imageFile", required = false) MultipartFile imageFile
    ) {
        logger.info("employeeRequest: {}", customerCreateRequest);
        logger.info("addressesRequest: {}", addressesRequest);
        return new ResponseData<>(HttpStatus.CREATED.value(),
                "Added employee successfully",
                this.customerService.addCustomer(customerCreateRequest, imageFile, addressesRequest)
        );
    }

    @GetMapping("/{id}")
    public ResponseData<?> getCustomerById(@PathVariable @Min(value = 1, message = "Invalid ID") Long id) {
        return new ResponseData<>(HttpStatus.OK.value(),
                "Retrieved employee successfully",
                this.customerService.getCustomerById(id)
        );
    }

    @GetMapping
    public ResponseData<?> getDataPage(
            @Valid @ModelAttribute CustomerFilterRequest customerFilterRequest
    ) {
        logger.info("customerFilterRequest: {}", customerFilterRequest);
        return new ResponseData<>(HttpStatus.OK.value(),
                "Retrieved all employees successfully",
                this.customerService.getPageData(customerFilterRequest)
        );
    }

    @GetMapping("/age-range")
    public ResponseData<?> getCustomerAgeRange() {
        return new ResponseData<>(HttpStatus.OK.value(),
                "Customer age range fetched successfully",
                this.customerService.getCustomerAgeRange()
        );
    }
}
