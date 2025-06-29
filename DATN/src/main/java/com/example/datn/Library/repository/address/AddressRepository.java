package com.example.datn.Library.repository.address;

import com.example.datn.Library.model.entity.adress.Address;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AddressRepository  extends JpaRepository<Address, Long> {
    List<Address> getAddressesByCustomerId(Integer customerId);
}
