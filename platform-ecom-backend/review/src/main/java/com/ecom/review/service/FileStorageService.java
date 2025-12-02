package com.ecom.review.service;

import org.springframework.web.multipart.MultipartFile;


public interface FileStorageService {


    String storeFile(MultipartFile file);


    void deleteFile(String fileName);


    String getFilePath(String fileName);
}
