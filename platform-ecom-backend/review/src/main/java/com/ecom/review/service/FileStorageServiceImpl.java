package com.ecom.review.service;

import com.ecom.common.exception.APIException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Slf4j
@Service
public class FileStorageServiceImpl implements FileStorageService {

    private static final String INVALID_PATH_SEQUENCE = "..";
    private static final String UNDERSCORE = "_";

    private final Path fileStorageLocation;

    public FileStorageServiceImpl(@Value("${review.image.upload.dir:uploads/reviews}") String uploadDir) {
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();

        try {
            Files.createDirectories(this.fileStorageLocation);
            log.info("File storage location created/verified at: {}", this.fileStorageLocation);
        } catch (Exception ex) {
            log.error("Failed to create file storage directory", ex);
            throw new APIException("Could not create the directory where the uploaded files will be stored.");
        }
    }

    @Override
    public String storeFile(MultipartFile file) {
        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());

        validateFileName(originalFileName);

        try {
            String newFileName = generateUniqueFileName(originalFileName);
            Path targetLocation = this.fileStorageLocation.resolve(newFileName);

            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            log.info("File stored successfully: {}", newFileName);
            return newFileName;
        } catch (IOException ex) {
            log.error("Failed to store file: {}", originalFileName, ex);
            throw new APIException("Could not store file " + originalFileName + ". Please try again!");
        }
    }

    @Override
    public void deleteFile(String fileName) {
        try {
            Path filePath = this.fileStorageLocation.resolve(fileName).normalize();

            // Security check to ensure the file is within the allowed directory
            if (!filePath.startsWith(this.fileStorageLocation)) {
                throw new APIException("Cannot delete file outside of allowed directory");
            }

            boolean deleted = Files.deleteIfExists(filePath);

            if (deleted) {
                log.info("File deleted successfully: {}", fileName);
            } else {
                log.warn("File not found for deletion: {}", fileName);
            }
        } catch (IOException ex) {
            log.error("Failed to delete file: {}", fileName, ex);
            throw new APIException("Could not delete file " + fileName + ". Please try again!");
        }
    }

    @Override
    public String getFilePath(String fileName) {
        if (fileName == null || fileName.trim().isEmpty()) {
            return null;
        }

        Path filePath = this.fileStorageLocation.resolve(fileName).normalize();

        // Security check
        if (!filePath.startsWith(this.fileStorageLocation)) {
            throw new APIException("Invalid file path");
        }

        return filePath.toString();
    }

    // ==================== Private Helper Methods ====================

    private void validateFileName(String fileName) {
        if (fileName.contains(INVALID_PATH_SEQUENCE)) {
            log.error("Invalid filename containing path sequence: {}", fileName);
            throw new APIException("Filename contains invalid path sequence: " + fileName);
        }
    }

    private String generateUniqueFileName(String originalFileName) {
        return UUID.randomUUID().toString() + UNDERSCORE + originalFileName;
    }
}
