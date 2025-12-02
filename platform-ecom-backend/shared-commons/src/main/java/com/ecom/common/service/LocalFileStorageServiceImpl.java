package com.ecom.common.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class LocalFileStorageServiceImpl implements FileStorageService {

    private final Path fileStorageLocation;

    public LocalFileStorageServiceImpl(@Value("${image.base.url:uploads}") String uploadDir) {
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        createUploadDirectory();
    }

    @Override
    public String storeFile(MultipartFile file) {
        String fileName = StringUtils.cleanPath(getOriginalFilename(file));
        validateFileName(fileName);

        try {
            String newFileName = generateUniqueFileName(fileName);
            Path targetLocation = this.fileStorageLocation.resolve(newFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            return newFileName;
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + fileName + ". Please try again!", ex);
        }
    }

    @Override
    public void deleteFile(String fileName) {
        try {
            Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
            Files.deleteIfExists(filePath);
        } catch (IOException ex) {
            throw new RuntimeException("Could not delete file " + fileName + ". Please try again!", ex);
        }
    }

    @Override
    public String getFilePath(String fileName) {
        return this.fileStorageLocation.resolve(fileName).toString();
    }

    // ==================== Private Helper Methods ====================

    private void createUploadDirectory() {
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    private String getOriginalFilename(MultipartFile file) {
        String filename = file.getOriginalFilename();
        return filename != null ? filename : "unknown_file";
    }

    private void validateFileName(String fileName) {
        if (fileName.contains("..")) {
            throw new RuntimeException("Sorry! Filename contains invalid path sequence " + fileName);
        }
    }

    private String generateUniqueFileName(String fileName) {
        return UUID.randomUUID().toString() + "_" + fileName;
    }
}
