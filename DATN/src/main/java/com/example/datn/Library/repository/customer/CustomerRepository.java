package com.example.datn.Library.repository.customer;

import com.example.datn.Library.model.entity.customer.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Page<Customer> findAll(Specification<Customer> spec, Pageable pageable);
    boolean existsByEmail(String email);
    boolean existsByPhoneNumber(String phoneNumber);
    long count();
    // Lấy khách hàng có ngày sinh nhỏ nhất (tuổi lớn nhất)
    Customer findTopByOrderByBirthDateAsc();
    // Lấy khách hàng có ngày sinh lớn nhất (tuổi nhỏ nhất)
    Customer findTopByOrderByBirthDateDesc();
}
