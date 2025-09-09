package com.ecommerce.project.service;

import com.ecommerce.project.model.Asset;
import com.ecommerce.project.payload.AssetDTO;
import com.ecommerce.project.payload.AssetResponse;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface AssetService {

    AssetResponse getAssetByProductName(String productName);

    AssetDTO upload(MultipartFile file, String productName) throws IOException;

    String deleteAsset(Long assetId);
}
