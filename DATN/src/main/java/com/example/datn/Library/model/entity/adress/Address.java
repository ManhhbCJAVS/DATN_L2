package com.example.datn.Library.model.entity.adress;

import com.example.datn.Library.model.entity.customer.Customer;
import com.example.datn.Library.model.enums.Status;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "DiaChi")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@ToString
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_khach_hang", referencedColumnName = "id")
    Customer customer;

    @Column(name = "tinh_thanh_pho")
    String city;

    @Column(name = "quan_huyen")
    String district;

    @Column(name = "xa_phuong")
    String ward;

    @Column(name = "so_nha_ngo_duong")
    String street;

    @Column(name = "ghi_chu")
    String note;//TODO: Nên bỏ (Cái này để hđ lưu)

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

    @Override
    public String toString() {
        return "Address{" +
                "id=" + id +
                ", city='" + city + '\'' +
                ", district='" + district + '\'' +
                ", ward='" + ward + '\'' +
                ", street='" + street + '\'' +
                ", note='" + note + '\'' +
                ", createdDate=" + createdAt +
                ", updatedDate=" + updatedAt +
                ", status=" + status +
                //", customerId=" + customer.getId() +
                '}';
    }
}
