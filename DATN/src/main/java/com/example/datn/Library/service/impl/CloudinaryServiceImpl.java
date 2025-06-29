package com.example.datn.Library.service.impl;

import com.cloudinary.Cloudinary;
import com.example.datn.Library.exception.CloudinaryException;
import com.example.datn.Library.model.dto.response.image.ImageUploadResponse;
import com.example.datn.Library.service.interfaces.CloudinaryService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CloudinaryServiceImpl implements CloudinaryService {

    final Cloudinary cloudinary;

    public ImageUploadResponse uploadOrUpdateImage(MultipartFile file, String publicId) {
        try {
            if (file == null || file.isEmpty()) {
                throw new CloudinaryException("INVALID_FILE", "File is empty or null");
            }

            Map<String, Object> params = publicId == null ? Map.of() : Map.of("public_id", publicId);

            Map result = cloudinary.uploader().upload(file.getBytes(), params);
            return ImageUploadResponse.builder()
                    .publicId((String) result.get("public_id"))
                    .url((String) result.get("secure_url"))
                    .build();
        } catch (IOException e) {
            throw new CloudinaryException("UPLOAD_FAILED", "Failed to upload/update image: " + e.getMessage(), e);
        }
    }

    @Override
    public boolean deleteImage(String publicId) {
        try {
            if (publicId == null || publicId.isBlank()) {
                throw new CloudinaryException("INVALID_PUBLIC_ID", "Public ID is empty or null");
            }
            Map result = cloudinary.uploader().destroy(publicId, Map.of());
            return "ok".equals(result.get("result"));
        } catch (Exception e) {
            throw new CloudinaryException("DELETE_FAILED", "Failed to delete image: " + e.getMessage(), e);
        }
    }

}
