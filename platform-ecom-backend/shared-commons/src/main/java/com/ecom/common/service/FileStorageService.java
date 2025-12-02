package com.ecom.common.service;

import org.springframework.web.multipart.MultipartFile;

/**
 * Service interface for handling file storage operations.
 * Consolidated from multiple microservices.
 */
public interface FileStorageService {

    /**
     * Store a file and return the file name
     * 
     * @param file the file to store
     * @return the stored file name
     */
    String storeFile(MultipartFile file);

    /**
     * Delete a file by its name
     * 
     * @param fileName the name of the file to delete
     */
    void deleteFile(String fileName);

    /**
     * Get the full file path for a given file name
     * 
     * @param fileName the file name
     * @return the full file path
     */
    String getFilePath(String fileName);
}
