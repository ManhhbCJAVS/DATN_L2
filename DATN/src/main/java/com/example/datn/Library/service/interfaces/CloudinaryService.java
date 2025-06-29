package com.example.datn.Library.service.interfaces;


import com.example.datn.Library.model.dto.response.image.ImageUploadResponse;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;


public interface CloudinaryService {

    ImageUploadResponse uploadOrUpdateImage(MultipartFile file, String publicId);
    boolean deleteImage(String publicId) throws IOException;

}
