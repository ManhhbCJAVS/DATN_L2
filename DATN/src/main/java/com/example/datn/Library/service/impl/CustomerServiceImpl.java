package com.example.datn.Library.service.impl;


import com.example.datn.Library.exception.ResourceNotFoundException;
import com.example.datn.Library.model.dto.request.StatusUpdateRequest;
import com.example.datn.Library.model.dto.request.address.AddressRequest;
import com.example.datn.Library.model.dto.request.customer.CustomerCreateRequest;
import com.example.datn.Library.model.dto.request.customer.CustomerFilterRequest;

import com.example.datn.Library.model.dto.request.customer.CustomerUpdateRequest;
import com.example.datn.Library.model.dto.response.PageableResponse;
import com.example.datn.Library.model.dto.response.address.AddressCustomerResponse;
import com.example.datn.Library.model.dto.response.customer.CustomerDetailResponse;
import com.example.datn.Library.model.dto.response.customer.CustomerResponse;
import com.example.datn.Library.model.dto.response.image.ImageUploadResponse;
import com.example.datn.Library.model.entity.Image;
import com.example.datn.Library.model.entity.adress.Address;
import com.example.datn.Library.model.entity.customer.Customer;
import com.example.datn.Library.model.enums.Gender;
import com.example.datn.Library.model.enums.Status;
import com.example.datn.Library.model.mapper.address.AddressMapper;
import com.example.datn.Library.model.mapper.customer.CustomerMapper;
import com.example.datn.Library.repository.customer.CustomerRepository;
import com.example.datn.Library.service.interfaces.CloudinaryService;
import com.example.datn.Library.service.interfaces.CustomerService;
import com.example.datn.Library.utils.CustomerUtil;
import com.example.datn.Library.validation.CustomerValidation;
import com.example.datn.Library.validation.EmployeeValidation;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.Period;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CustomerServiceImpl implements CustomerService {
    private static final Logger logger = LoggerFactory.getLogger(EmployeeServiceImpl.class);
    final CustomerRepository customerRepository;
    final CustomerMapper customerMapper;
    final AddressMapper addressMapper;
    final CustomerValidation customerValidation;
    final CustomerUtil util;
    final CloudinaryService cloudinaryService;

    @Override
    @Transactional
    public CustomerDetailResponse updateStatus(Long id, StatusUpdateRequest statusUpdateRequest) {
        Customer existingCustomer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + id));
        existingCustomer.setStatus(statusUpdateRequest.getStatus());
        logger.info("Updating customer: {}", existingCustomer);
        return customerMapper.toCustomerDetailResponse(existingCustomer);
    }

    @Override
    @Transactional
    public CustomerDetailResponse updateCustomer(
            CustomerUpdateRequest customerUpdateRequest,
            MultipartFile imageFile
    ) {
        //TODO: Check exist customer
        Customer existingCustomer = customerRepository.findById(customerUpdateRequest.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + customerUpdateRequest.getId()));
        customerMapper.updateCustomerFromRequest(customerUpdateRequest, existingCustomer);
        if(imageFile != null && !imageFile.isEmpty()) {
            //TODO: Update image
            ImageUploadResponse imageUploadResponse =
                    cloudinaryService.uploadOrUpdateImage(
                            imageFile,
                            existingCustomer.getImage() != null
                                    ? existingCustomer.getImage().getPublicId()
                                    : null
                    );
            Image image = Image.builder()
                    .publicId(imageUploadResponse.getPublicId())
                    .imageUrl(imageUploadResponse.getUrl())
                    .build();
            existingCustomer.setImage(image);
        }
        logger.info("Updating customer: {}", existingCustomer);
        return customerMapper.toCustomerDetailResponse(existingCustomer);
    }

    @Override
    @Transactional
    public CustomerDetailResponse addCustomer(
            CustomerCreateRequest customerCreateRequest,
            MultipartFile imageFile,
            List<AddressRequest> addressesRequest
    ) {
        customerValidation.validateCreateCustomer(customerCreateRequest);//TODO: Business Rule Validation customer
        Customer customer = customerMapper.toCustomer(customerCreateRequest);
        //TODO: Image + Addresses
        if(imageFile != null && !imageFile.isEmpty()) {
            customer.setImage(getImage(imageFile));//TODO: convert imageFile --> Image (id, public_id, url).
        }
        if(addressesRequest != null && !addressesRequest.isEmpty()) {
            //TODO: List<AddressRequest> to List<Address>.
            customer.setAddresses(addressMapper.toAddressListWithCustomer(addressesRequest, customer));
        }
        customer.setStatus(Status.ACTIVE);//TODO: Set status
        customer.setCustomerCode(util.generateCustomerCode());//TODO: Set customerCode

        logger.info("Saving customer: {}", customer);
        customerRepository.save(customer);
        return customerMapper.toCustomerDetailResponse(customer);
    }

    @Override
    public CustomerDetailResponse getCustomerById(Long id) {
        logger.info("Fetching customer with ID: {}", id);
        return customerRepository.findById(id)
                .map(customerMapper::toCustomerDetailResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID " + id));
    }

    @Override
    public PageableResponse getPageData(CustomerFilterRequest param) {
        Specification<Customer> spec = buildSpecification(param);
        Pageable pageable = buildPageable(param);
        Page<Customer> page = customerRepository.findAll(spec, pageable);

        List<CustomerResponse> customerResponses =
                customerMapper.toCustomerResponseList(page.getContent());

        for (CustomerResponse response : customerResponses) {
            logger.info("CustomerResponse: {}", response);
        }
        return PageableResponse.builder()
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .pageSize(param.getPageSize())
                .pageNumber(param.getPageNo())
                .content(customerResponses)
                .build();
    }

    @Override
    public int[] getCustomerAgeRange() {
        Customer oldest = customerRepository.findTopByOrderByBirthDateAsc();
        Customer youngest = customerRepository.findTopByOrderByBirthDateDesc();
        int maxAge = 18;
        int minAge = 18;
        LocalDate now = LocalDate.now();
        if (oldest != null && oldest.getBirthDate() != null) {
            maxAge = Period.between(oldest.getBirthDate(), now).getYears();
        }
        if (youngest != null && youngest.getBirthDate() != null) {
            minAge = Period.between(youngest.getBirthDate(), now).getYears();
        }
        // Không ép minAge về 18 nữa, mà trả về đúng tuổi nhỏ nhất thực tế
        if (maxAge < minAge) maxAge = minAge;
        return new int[]{minAge, maxAge};
    }

    private Image getImage(MultipartFile imageFile) {
        //TODO: Push lên Cloudinary + Get Image.
        ImageUploadResponse imageUploadResponse = cloudinaryService.uploadOrUpdateImage(imageFile, null);
        Image image = Image.builder()
                .publicId(imageUploadResponse.getPublicId())
                .imageUrl(imageUploadResponse.getUrl())
                .build();
        return image;
    }


    private Pageable buildPageable(CustomerFilterRequest param) {
        Sort sort = StringUtils.hasLength(param.getSortBy())
                ? Sort.by(param.getSortDir().equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC, param.getSortBy())//not null
                : Sort.by(Sort.Direction.DESC, "createdAt");//null
        return PageRequest.of(param.getPageNo() - 1, param.getPageSize(), sort);
        /*
            example: pageNo = 1, pageSize = 10, sortBy = "name", sortDir = "asc".
                ==> PageRequest.of(0, 10, Sort.by(Sort.Direction.ASC, "name"))
         */
    }

    private Specification<Customer> buildSpecification(CustomerFilterRequest param) {
        return (root, query, cb) -> {
            ArrayList<Predicate> predicates = new ArrayList<>();
            Optional.ofNullable(param.getFilterByEmployeeName()) //Optional["John"] || Optional.empty()
                    .filter(StringUtils::hasLength)
                    .map(String::toLowerCase)// John --> john
                    .ifPresent(name -> predicates.add(buildNamePredicate(root, cb, name)));

            // Filter by gender
            Optional.ofNullable(param.getFilterByGender())
                    .ifPresent(gender -> predicates.add(buildGenderPredicate(root, cb, gender)));

            // Filter by phone number
            Optional.ofNullable(param.getFilterByPhoneNumber())
                    .filter(StringUtils::hasLength)
                    .ifPresent(phone -> predicates.add(buildPhoneNumberPredicate(root, cb, phone)));

            //             Filter by age range
            Optional.ofNullable(param.getMinAge())
                    .ifPresent(minAge -> predicates.add(buildMinAgePredicate(root, cb, minAge)));
            Optional.ofNullable(param.getMaxAge())
                    .ifPresent(maxAge -> predicates.add(buildMaxAgePredicate(root, cb, maxAge)));

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    private Predicate buildNamePredicate(Root<Customer> root, CriteriaBuilder cb, String name) {
        return cb.like(cb.lower(root.get("customerName")), "%" + name.toLowerCase() + "%");
    }

    private Predicate buildGenderPredicate(Root<Customer> root, CriteriaBuilder cb, Gender gender) {
        return cb.equal(root.get("gender"), gender);
    }

    private Predicate buildPhoneNumberPredicate(Root<Customer> root, CriteriaBuilder cb, String phoneNumber) {
        return cb.like(root.get("phoneNumber"), "%" + phoneNumber + "%"); // Updated to match entity field
    }

    private Predicate buildMinAgePredicate(Root<Customer> root, CriteriaBuilder cb, Integer minAge) {
        // Tính ngày sinh tối đa (tức là nhỏ nhất cho tuổi minAge)
        // birthDate <= today.minusYears(minAge)
        Expression<LocalDate> birthDate = root.get("birthDate");
        Expression<LocalDate> minBirthDate = cb.literal(LocalDate.now().minusYears(minAge));
        return cb.lessThanOrEqualTo(birthDate, minBirthDate);
    }

    private Predicate buildMaxAgePredicate(Root<Customer> root, CriteriaBuilder cb, Integer maxAge) {
        // Tính ngày sinh tối thiểu (tức là lớn nhất cho tuổi maxAge)
        // birthDate >= today.minusYears(maxAge+1).plusDays(1)
        Expression<LocalDate> birthDate = root.get("birthDate");
        Expression<LocalDate> maxBirthDate = cb.literal(LocalDate.now().minusYears(maxAge + 1).plusDays(1));
        return cb.greaterThanOrEqualTo(birthDate, maxBirthDate);
    }

}
