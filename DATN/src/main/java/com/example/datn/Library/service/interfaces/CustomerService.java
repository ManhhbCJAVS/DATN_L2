package com.example.datn.Library.service.interfaces;

import com.example.datn.Library.model.dto.request.StatusUpdateRequest;
import com.example.datn.Library.model.dto.request.address.AddressRequest;
import com.example.datn.Library.model.dto.request.customer.CustomerCreateRequest;
import com.example.datn.Library.model.dto.request.customer.CustomerFilterRequest;
import com.example.datn.Library.model.dto.request.customer.CustomerUpdateRequest;
import com.example.datn.Library.model.dto.request.employee.EmployeeUpdateRequest;
import com.example.datn.Library.model.dto.response.PageableResponse;
import com.example.datn.Library.model.dto.response.customer.CustomerDetailResponse;
import com.example.datn.Library.model.dto.response.employee.EmployeeDetailResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface CustomerService {

    PageableResponse getPageData(CustomerFilterRequest customerFilterRequest);

    CustomerDetailResponse getCustomerById(Long id);

    CustomerDetailResponse addCustomer(
            CustomerCreateRequest customerCreateRequest,
            MultipartFile imageFile,
            List<AddressRequest> addressesRequest
    );

    CustomerDetailResponse updateCustomer(
            CustomerUpdateRequest customerUpdateRequest,
            MultipartFile imageFile
    );
    CustomerDetailResponse updateStatus(Long id, StatusUpdateRequest statusUpdateRequest);

    // Trả về mảng 2 phần tử: [minAge, maxAge]
    int[] getCustomerAgeRange();
}
