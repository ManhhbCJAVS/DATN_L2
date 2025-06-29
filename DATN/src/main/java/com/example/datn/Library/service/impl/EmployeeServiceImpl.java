package com.example.datn.Library.service.impl;

import com.example.datn.Library.exception.ResourceNotFoundException;
import com.example.datn.Library.model.dto.request.StatusUpdateRequest;
import com.example.datn.Library.model.dto.request.employee.EmployeeFilterRequest;
import com.example.datn.Library.model.dto.request.employee.EmployeeCreateRequest;
import com.example.datn.Library.model.dto.request.employee.EmployeeUpdateRequest;
import com.example.datn.Library.model.dto.response.image.ImageUploadResponse;
import com.example.datn.Library.model.dto.response.PageableResponse;
import com.example.datn.Library.model.dto.response.employee.EmployeeDetailResponse;
import com.example.datn.Library.model.dto.response.employee.EmployeeResponse;
import com.example.datn.Library.model.entity.Image;
import com.example.datn.Library.model.entity.employee.Employee;
import com.example.datn.Library.model.enums.Gender;
import com.example.datn.Library.model.enums.Status;
import com.example.datn.Library.model.mapper.employee.EmployeeMapper;
import com.example.datn.Library.repository.employee.EmployeeRepository;
import com.example.datn.Library.service.interfaces.CloudinaryService;
import com.example.datn.Library.service.interfaces.EmployeeService;
import com.example.datn.Library.utils.EmployeeUtil;
import com.example.datn.Library.utils.PasswordGenerator;
import com.example.datn.Library.validation.EmployeeValidation;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Root;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import jakarta.persistence.criteria.Predicate;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EmployeeServiceImpl implements EmployeeService {

    private static final Logger logger = LoggerFactory.getLogger(EmployeeServiceImpl.class);
    final EmployeeRepository employeeRepository;
    final EmployeeMapper employeeMapper;

    final EmployeeValidation employeeValidation;

    final EmployeeUtil util;
    final CloudinaryService cloudinaryService;

    final PasswordGenerator passwordGenerator;

    final PasswordEncoder passwordEncoder;

    final EmailService emailService;

    @Override
    @Transactional
    public EmployeeDetailResponse updateStatus(Long id, StatusUpdateRequest statusUpdateRequest) {
        Employee existingEmployee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with ID: " + id));
        existingEmployee.setStatus(statusUpdateRequest.getStatus());
        logger.debug("Employee update status: {}", existingEmployee);
        return employeeMapper.toEmployeeDetailResponse(existingEmployee);
    }

    @Override
    @Transactional
    public EmployeeDetailResponse updateEmployee(EmployeeUpdateRequest employeeUpdateRequest, MultipartFile imageFile) {
        //TODO: check exist employee
        Employee existingEmployee = employeeRepository.findById(employeeUpdateRequest.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with ID: " + employeeUpdateRequest.getId()));
        //TODO: Check Duplicate SĐT/Email/CCCD.
        employeeMapper.updateEmployeeFromRequest(employeeUpdateRequest, existingEmployee);//TODO: Update
        if (imageFile != null && !imageFile.isEmpty()) {
            ImageUploadResponse imageUploadResponse = cloudinaryService.uploadOrUpdateImage(
                    imageFile,
                    existingEmployee.getImage() != null ? existingEmployee.getImage().getPublicId() : null
            );
            Image image = Image.builder()
                    .publicId(imageUploadResponse.getPublicId())
                    .imageUrl(imageUploadResponse.getUrl())
                    .build();
            existingEmployee.setImage(image);
        }
        logger.info("EmployeeExisting: {}", existingEmployee);
        return employeeMapper.toEmployeeDetailResponse(existingEmployee);
    }

    //TODO: ADD : Bổ sung gửi tk+psw qua email.
    @Override
    @Transactional
    public EmployeeDetailResponse addEmployee(EmployeeCreateRequest employeeCreateRequest, MultipartFile imageFile) {
        employeeValidation.validateCreateEmployee(employeeCreateRequest);//TODO: Business Rule Validation employee
        Employee employee = employeeMapper.toEmployee(employeeCreateRequest);//TODO: Mapper employeeCreateRequest to employee
        ImageUploadResponse imageUploadResponse = cloudinaryService.uploadOrUpdateImage(imageFile, null);
        Image image = Image.builder()
                .publicId(imageUploadResponse.getPublicId())
                .imageUrl(imageUploadResponse.getUrl())
                .build();

        String generatedPassword = passwordGenerator.generatePassword();
        employee.setPassword(passwordEncoder.encode(generatedPassword));
        emailService.sendEmailToEmp(employee, generatedPassword);//TODO: send psw to email

        employee.setEmployeeCode(util.generateEmployeeCode());//TODO: set employee code
        employee.setStatus(Status.ACTIVE);//TODO: set employee status

        employee.setImage(image);
        logger.info("Employee: {}", employee);
        employeeRepository.save(employee);
        return employeeMapper.toEmployeeDetailResponse(employee);//TODO: Mapper employee to employeeDetailResponse --> return.
    }

    @Override
    public EmployeeDetailResponse getEmployeeById(Long id) {
        logger.info("Fetching employee with ID: {}", id);
        return employeeRepository.findById(id)
                .map(employeeMapper::toEmployeeDetailResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with ID: " + id));
    }

    @Override
    public PageableResponse getPageData(EmployeeFilterRequest param) {
        Specification<Employee> spec = buildSpecification(param);
        Pageable pageable = buildPageable(param);
        Page<Employee> page = employeeRepository.findAll(spec, pageable);
        logger.debug("page: {}", page.getContent());

        List<EmployeeResponse> employeeResponses = employeeMapper.toEmployeeResponseList(page.getContent());
        return PageableResponse.builder()
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .pageSize(param.getPageSize())
                .pageNumber(param.getPageNo())
                .content(employeeResponses)
                .build();
    }



    private Pageable buildPageable(EmployeeFilterRequest param) {
        Sort sort = StringUtils.hasLength(param.getSortBy())
                ? Sort.by(param.getSortDir().equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC, param.getSortBy())//not null
                : Sort.by(Sort.Direction.DESC, "createdAt");//null
        return PageRequest.of(param.getPageNo() - 1, param.getPageSize(), sort);
        /*
            example: pageNo = 1, pageSize = 10, sortBy = "name", sortDir = "asc".
                ==> PageRequest.of(0, 10, Sort.by(Sort.Direction.ASC, "name"))
         */
    }

    private Specification<Employee> buildSpecification(EmployeeFilterRequest param) {
        return (root, query, cb) -> {
            ArrayList<Predicate> predicates = new ArrayList<>();
            Optional.ofNullable(param.getFilterByEmployeeName()) //Optional["John"] || Optional.empty()
                    .filter(StringUtils::hasLength)
                    .map(String::toLowerCase)// John --> john
                    .ifPresent(name -> predicates.add(buildNamePredicate(root, cb, name)));

            // Filter by gender
            Optional.ofNullable(param.getFilterByGender())
                    .ifPresent(gender -> predicates.add(buildGenderPredicate(root, cb, gender)));

            // Filter by status
            Optional.ofNullable(param.getFilterByStatus())
                    .ifPresent(status -> predicates.add(buildStatusPredicate(root, cb, status)));

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

    private Predicate buildNamePredicate(Root<Employee> root, CriteriaBuilder cb, String name) {
        return cb.like(cb.lower(root.get("employeeName")), "%" + name.toLowerCase() + "%");
    }

    private Predicate buildGenderPredicate(Root<Employee> root, CriteriaBuilder cb, Gender gender) {
        return cb.equal(root.get("gender"), gender);
    }

    private Predicate buildStatusPredicate(Root<Employee> root, CriteriaBuilder cb, Status status) {
        return cb.equal(root.get("status"), status);
    }

    private Predicate buildPhoneNumberPredicate(Root<Employee> root, CriteriaBuilder cb, String phoneNumber) {
        return cb.like(root.get("phoneNumber"), "%" + phoneNumber + "%"); // Updated to match entity field
    }

    private Predicate buildMinAgePredicate(Root<Employee> root, CriteriaBuilder cb, Integer minAge) {
        Expression<Integer> currentYear = cb.function("YEAR", Integer.class, cb.currentDate());
        Expression<Integer> birthYear = cb.function("YEAR", Integer.class, root.get("birthDate"));
        Expression<Integer> age = cb.diff(currentYear, birthYear);
        return cb.greaterThanOrEqualTo(age, minAge);
    }

    private Predicate buildMaxAgePredicate(Root<Employee> root, CriteriaBuilder cb, Integer maxAge) {
        Expression<Integer> currentYear = cb.function("YEAR", Integer.class, cb.currentDate());
        Expression<Integer> birthYear = cb.function("YEAR", Integer.class, root.get("birthDate"));
        Expression<Integer> age = cb.diff(currentYear, birthYear);
        return cb.lessThanOrEqualTo(age, maxAge);
    }

    /*
    WHERE
        LOWER(e1_0.ten_nhan_vien) LIKE '%'  -- k ảnh hưởng đến kq.
        AND e1_0.gioi_tinh = 'MALE'
        AND e1_0.trang_thai = 'ACTIVE'
        AND e1_0.so_dien_thoai LIKE '%09%'
        AND (
            YEAR(CONVERT(date, GETDATE())) - YEAR(e1_0.ngay_sinh)
        ) >= 30
        AND (
            YEAR(CONVERT(date, GETDATE())) - YEAR(e1_0.ngay_sinh)
        ) <= 35
    ORDER BY
        e1_0.ngay_tao DESC
    OFFSET
        0 ROWS
    FETCH
        FIRST 5 ROWS ONLY
     */

}
