package com.example.datn.Library.model.entity.customer;


import com.example.datn.Library.model.entity.Image;
import com.example.datn.Library.model.entity.adress.Address;
import com.example.datn.Library.model.enums.Gender;
import com.example.datn.Library.model.enums.Status;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import jakarta.persistence.Table;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.IdentityHashMap;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "KhachHang")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "id_hinh_anh", referencedColumnName = "id")
    Image image;

    @OneToMany( cascade = CascadeType.ALL, mappedBy = "customer", fetch = FetchType.LAZY)
    List<Address> addresses; //TODO: Thêm mql phục vụ mapper.

    @Column(name = "ma_khach_hang", length = 50)
    String customerCode;

    @Column(name = "ten_khach_hang", length = 100, columnDefinition = "NVARCHAR(100)")
    String customerName;

    @Enumerated(EnumType.STRING)
    @Column(name = "gioi_tinh")
    Gender gender;

    @Column(name = "ngay_sinh")
    LocalDate birthDate;

    @Column(name = "so_dien_thoai", length = 15)
    String phoneNumber;

    @Column(name = "email", length = 100)
    String email;

    @Column(name = "mat_khau", columnDefinition = "NVARCHAR(255)")
    String password;

    @Column(name = "ngay_tao")
    LocalDateTime createdAt;

    @Column(name = "ngay_sua")
    LocalDateTime updatedAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai", nullable = false)
    Status status;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
