package com.ecommerce.project.controller;


import com.ecommerce.project.payload.AssetDTO;
import com.ecommerce.project.payload.AssetResponse;
import com.ecommerce.project.service.AssetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class AssetController {


    @Autowired
    AssetService assetService;

    @GetMapping("/public/assets/{productName}")
    public ResponseEntity<AssetResponse> getAssetByProductName(@PathVariable String productName) {
        AssetResponse assetResponse = assetService.getAssetByProductName(productName);
        return new ResponseEntity<AssetResponse>(assetResponse, HttpStatus.OK);
    }

    @PostMapping("/assets/upload")
    public ResponseEntity<AssetDTO> uploadProductImages(
            @RequestParam("productName") String productName,
            @RequestParam("image") MultipartFile file) throws IOException {

        AssetDTO asset = assetService.upload(file, productName);
        return new ResponseEntity<AssetDTO>(asset, HttpStatus.OK);
    }

    @DeleteMapping("/assets/{assetId}")
    public ResponseEntity<Map<String, String>> deleteAsset(@PathVariable Long assetId) {
        String status = assetService.deleteAsset(assetId);
        Map<String, String> resp = new HashMap<>();
        resp.put("status", status);
        return new ResponseEntity<Map<String, String>>(resp, HttpStatus.OK);
    }
}
