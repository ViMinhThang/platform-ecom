package com.ecommerce.project.service;

import com.ecommerce.project.exceptions.ResourceNotFoundException;
import com.ecommerce.project.model.Asset;
import com.ecommerce.project.model.Product;
import com.ecommerce.project.payload.AssetDTO;
import com.ecommerce.project.payload.AssetResponse;
import com.ecommerce.project.repositories.AssetRepository;
import com.ecommerce.project.repositories.ProductRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class AssetServiceImpl implements AssetService {

    @Value("${project.image}")
    private String path;

    @Autowired
    ProductRepository productRepository;

    @Autowired
    AssetRepository assetRepository;

    @Autowired
    ModelMapper modelMapper;

    @Autowired
    FileService fileService;

    @Override
    public AssetResponse getAssetByProductName(String productName) {
        Product product = productRepository.findProductByProductNameLikeIgnoreCase(productName)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "ProductName", productName));

        List<Asset> assets = assetRepository.findByProduct_ProductId(product.getProductId());
        List<AssetDTO> assetDTOS = assets.stream().map(asset -> modelMapper.map(asset, AssetDTO.class)).toList();
        AssetResponse assetResponse = new AssetResponse(assetDTOS);
        return assetResponse;
    }

    @Override
    public AssetDTO upload(MultipartFile file, String productName) throws IOException {
        Product product = productRepository.findProductByProductNameLikeIgnoreCase(productName)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "ProductName", productName));
        String fileName = fileService.uploadImage(path, file);

        Asset asset = new Asset();
        asset.setUrl(fileName);
        asset.setProduct(product);
        Asset savedByDB = assetRepository.save(asset);
        return modelMapper.map(savedByDB, AssetDTO.class);
    }
}
