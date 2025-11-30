package com.ecom.review.controller;

import com.ecom.review.dto.APIResponse;
import com.ecom.review.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

/**
 * Controller for handling file upload operations for review images
 */
@Slf4j
@RestController
@RequestMapping("/api/reviews/files")
@RequiredArgsConstructor
public class FileController {

    private final FileStorageService fileStorageService;

    @Value("${image.base.url}")
    private String imageBaseUrl;

    /**
     * Upload a single review image
     */
    @PostMapping("/upload")
    public ResponseEntity<FileUploadResponse> uploadFile(@RequestParam("file") MultipartFile file) {
        log.info("Uploading file: {}", file.getOriginalFilename());

        String fileName = fileStorageService.storeFile(file);
        String fileUrl = imageBaseUrl + fileName;

        FileUploadResponse response = new FileUploadResponse(fileName, fileUrl, file.getSize());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Upload multiple review images
     */
    @PostMapping("/upload/multiple")
    public ResponseEntity<MultipleFileUploadResponse> uploadMultipleFiles(
            @RequestParam("files") MultipartFile[] files) {
        log.info("Uploading {} files", files.length);

        List<FileUploadResponse> uploadedFiles = new ArrayList<>();

        for (MultipartFile file : files) {
            String fileName = fileStorageService.storeFile(file);
            String fileUrl = imageBaseUrl + fileName;
            uploadedFiles.add(new FileUploadResponse(fileName, fileUrl, file.getSize()));
        }

        MultipleFileUploadResponse response = new MultipleFileUploadResponse(uploadedFiles);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Delete a review image
     */
    @DeleteMapping("/{fileName}")
    public ResponseEntity<APIResponse> deleteFile(@PathVariable String fileName) {
        log.info("Deleting file: {}", fileName);

        fileStorageService.deleteFile(fileName);
        return ResponseEntity.ok(new APIResponse("File deleted successfully", true));
    }

    // ==================== Response DTOs ====================

    /**
     * Response for single file upload
     */
    public record FileUploadResponse(
            String fileName,
            String fileUrl,
            long fileSize) {
    }

    /**
     * Response for multiple file uploads
     */
    public record MultipleFileUploadResponse(
            List<FileUploadResponse> files) {
    }
}
