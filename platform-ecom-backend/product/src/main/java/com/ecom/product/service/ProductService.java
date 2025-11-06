package com.ecom.product.service;

import com.ecom.product.dto.ProductDTO;
import com.ecom.product.dto.ProductResponse;
import com.ecom.product.dto.ProductRowDTO;
//import com.ecom.product.dto.ReduceStockDTO;
import jakarta.validation.Valid;

import java.util.List;

public interface ProductService {

    ProductDTO createProduct(@Valid ProductDTO productDTO, Long userId);

    ProductDTO getProductById(Long productId);

    ProductDTO updateProduct(Long productId, @Valid ProductDTO productDTO);

    ProductDTO deleteProduct(Long productId);

    ProductResponse getAllProductsForSeller(Integer page, Integer perPage, String name, String category, String sortBy, String sortOrder, Long userId);

//    ProductResponse searchByCategory(Long categoryId, Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);

//    String reduceStocks(List<ReduceStockDTO> reduceStockDTOS);

//    Long getProductCounts();

//    List<ProductRowDTO> getProductRowsForSeller(Integer page, Integer perPage, String name, String category, String sortBy, String sortOrder, Long userId);
}
