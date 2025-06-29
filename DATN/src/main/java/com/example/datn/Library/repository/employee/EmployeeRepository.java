package com.example.datn.Library.repository.employee;

import com.example.datn.Library.model.entity.employee.Employee;

import com.example.datn.Library.service.interfaces.EmployeeService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Page<Employee> findAll(Specification<Employee> spec, Pageable pageable);

    EmployeeRepository findById(Integer id);
    boolean existsByEmail(String email);

    boolean existsByPhoneNumber(String phoneNumber);
    boolean existsByCitizenId(String citizenId);

    long count();
}
