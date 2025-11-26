package com.ecom.product.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileServiceImpl implements FileService {

    @Override
    public String uploadImage(String uploadDir, MultipartFile file) throws IOException {
        String originalFileName = file.getOriginalFilename();
        if (originalFileName == null) {
            throw new IOException("File name cannot be null");
        }

        String uniqueFileName = generateUniqueFileName(originalFileName);
        Path filePath = Paths.get(uploadDir, uniqueFileName);

        ensureDirectoryExists(uploadDir);
        
        Files.copy(file.getInputStream(), filePath);
        
        return uniqueFileName;
    }

    private String generateUniqueFileName(String originalFileName) {
        String randomId = UUID.randomUUID().toString();
        String extension = originalFileName.substring(originalFileName.lastIndexOf('.'));
        return randomId.concat(extension);
    }

    private void ensureDirectoryExists(String path) {
        File folder = new File(path);
        if (!folder.exists()) {
            folder.mkdirs();
        }
    }
}