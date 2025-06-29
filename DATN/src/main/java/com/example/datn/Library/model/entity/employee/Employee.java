package com.example.datn.Library.model.entity.employee;


import com.example.datn.Library.model.entity.Image;
import com.example.datn.Library.model.entity.adress.Address;
import com.example.datn.Library.model.enums.Gender;
import com.example.datn.Library.model.enums.Role;
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

@Getter
@Setter
@Entity
@Table(name = "NhanVien")
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder()
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Tự động tăng tương ứng IDENTITY trong SQL Server
    Long id;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY ) // Cascade để tự động lưu/sửa/xóa Address khi thao tác với Employee
    @JoinColumn(name = "id_dia_chi", referencedColumnName = "id") // Khóa ngoại trong bảng NhanVien
    Address address;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "id_hinh_anh", referencedColumnName = "id")
    Image image;

    @Enumerated(EnumType.STRING)// --> 1
    @Column(name = "vai_tro", nullable = false)
    Role role;

    @Column(name = "ma_nhan_vien", length = 50)
    String employeeCode;

    @Column(name = "ten_nhan_vien", length = 100, columnDefinition = "NVARCHAR(100)")
    String employeeName;

    @Enumerated(EnumType.STRING)
    @Column(name = "gioi_tinh")
    Gender gender;

    @Column(name = "ngay_sinh")
    LocalDate birthDate;

    @Column(name = "so_dien_thoai", length = 15)
    String phoneNumber;

    @Column(name = "can_cuoc_cong_dan", length = 20)
    String citizenId;

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

    // Tự động gán createdAt và updatedAt trước khi lưu mới
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    // Tự động gán updatedAt trước khi cập nhật
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    @Override
    public String toString() {
        return "Employee{" +
                "id=" + id +
                ", role=" + role +
                ", employeeCode='" + employeeCode + '\'' +
                ", employeeName='" + employeeName + '\'' +
                ", image='" + image + '\'' +
                ", gender='" + gender + '\'' +
                ", birthDate=" + birthDate +
                ", phoneNumber='" + phoneNumber + '\'' +
                ", citizenId='" + citizenId + '\'' +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                ", status='" + status + '\'' +
                ", address=" + address +
                '}';
    }
}
