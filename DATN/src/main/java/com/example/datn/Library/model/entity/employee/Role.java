//package com.example.datn.Library.model.entity.employee;
//
//
//import jakarta.persistence.Column;
//import jakarta.persistence.Entity;
//import jakarta.persistence.GeneratedValue;
//import jakarta.persistence.GenerationType;
//import jakarta.persistence.Id;
//import lombok.AccessLevel;
//import lombok.AllArgsConstructor;
//import lombok.Builder;
//import lombok.Getter;
//import lombok.NoArgsConstructor;
//import lombok.Setter;
//import lombok.experimental.FieldDefaults;
//import jakarta.persistence.Table;
//
//@Getter
//@Setter
//@Entity
//@Table(name = "VaiTro")
//@Builder
//@AllArgsConstructor
//@NoArgsConstructor
//@FieldDefaults(level = AccessLevel.PRIVATE)
//public class Role {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    Integer id;
//
//    @Column(name = "ten_vai_tro", length = 50)
//    String name; // Tên vai trò, ví dụ: "Admin", "User", "Manager", v.v.
//
//    @Column(name = "mo_ta_vai_tro", length = 50)
//    String description; // Mô tả về vai trò, có thể để trống nếu không cần thiết
//
//    @Override
//    public String toString() {
//        return "Role{" +
//                "id=" + id +
//                ", name='" + name + '\'' +
//                ", description='" + description + '\'' +
//                '}';
//    }
//
//}
