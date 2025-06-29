package com.example.datn.Library.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Entity
@Table(name = "HinhAnh")
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder()
public class Image {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Tự động tăng tương ứng IDENTITY trong SQL Server
    Long id;

    @Column(name = "public_id", length = 255)
    String publicId;

    @Column(name = "image_url", length = 1000)
    String imageUrl;


    @Override
    public String toString() {
        return "Image{" +
                "id=" + id +
                ", publicId='" + publicId + '\'' +
                ", imageUrl='" + imageUrl + '\'' +
                '}';
    }
}
