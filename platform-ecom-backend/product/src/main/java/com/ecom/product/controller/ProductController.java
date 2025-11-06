package com.ecom.product.controller;

import com.ecom.product.aspect.RequireRole;
import com.ecom.product.config.AppConstants;
import com.ecom.product.config.AuthContext;
import com.ecom.product.dto.ProductDTO;
import com.ecom.product.dto.ProductOptionDTO;
import com.ecom.product.dto.ProductResponse;
import com.ecom.product.dto.ProductRowDTO;
import com.ecom.product.entity.ProductOption;
import com.ecom.product.service.ProductService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@Slf4j
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private AuthContext authContext;


    @GetMapping("/seller")
    @RequireRole("ROLE_SELLER")
    public ResponseEntity<ProductResponse> getSellerProducts(
            @RequestParam(name = "page", defaultValue = "0", required = false) Integer page,
            @RequestParam(name = "perPage", defaultValue = "10", required = false) Integer perPage,
            @RequestParam(name = "name", required = false) String name,
            @RequestParam(name = "category", required = false) String category,
            @RequestParam(name = "sortBy", defaultValue = "createdAt", required = false) String sortBy,
            @RequestParam(name = "sortOrder", defaultValue = "desc", required = false) String sortOrder,
            HttpServletRequest request
    ) {
        Long userId = authContext.getUserId(request);
        ProductResponse productResponse = productService.getAllProductsForSeller(page, perPage, name, category, sortBy, sortOrder, userId);
        return new ResponseEntity<>(productResponse, HttpStatus.OK);
    }
    @PostMapping("/seller")
    @RequireRole("ROLE_SELLER")
    public ResponseEntity<ProductDTO> createProduct(@Valid @RequestBody ProductDTO productDTO, HttpServletRequest request) {
        Long userId = authContext.getUserId(request);
        ProductDTO savedProduct = productService.createProduct(productDTO, userId);
        return new ResponseEntity<>(savedProduct, HttpStatus.CREATED);
    }

    @PutMapping("seller/{productId}")
    @RequireRole("ROLE_SELLER")
    public ResponseEntity<ProductDTO> updateProduct(@PathVariable Long productId, @Valid @RequestBody ProductDTO productDTO) {
        ProductDTO updatedProduct = productService.updateProduct(productId, productDTO);
        return new ResponseEntity<>(updatedProduct, HttpStatus.OK);
    }

    @DeleteMapping("seller/{productId}")
    @RequireRole("ROLE_SELLER")
    public ResponseEntity<ProductDTO> deleteProduct(@PathVariable Long productId) {
        ProductDTO deletedProduct = productService.deleteProduct(productId);
        return new ResponseEntity<>(deletedProduct, HttpStatus.OK);
    }

    @GetMapping("seller/{productId}")
    @RequireRole("ROLE_SELLER")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Long productId) {
        ProductDTO productDTO = productService.getProductById(productId);
        return new ResponseEntity<>(productDTO, HttpStatus.OK);
    }

}
