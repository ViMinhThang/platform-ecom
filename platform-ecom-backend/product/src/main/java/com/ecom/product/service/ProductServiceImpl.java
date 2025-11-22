package com.ecom.product.service;

import com.ecom.product.dto.CategoryDTO;
import com.ecom.product.dto.ProductDTO;
import com.ecom.product.dto.ProductResponse;
import com.ecom.product.dto.ProductRowDTO;
import com.ecom.product.entity.Category;
import com.ecom.product.entity.Product;
import com.ecom.product.exceptions.ResourceNotFoundException;
import com.ecom.product.repository.CategoryRepository;
import com.ecom.product.repository.ProductRepository;
import com.ecom.product.repository.ProductVariantRepository;
import com.ecom.product.utils.ProductUtils;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;


@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private ModelMapper modelMapper;

//    private CartServiceClient cartServiceClient;

    @Override
    public ProductRowDTO createProduct(ProductDTO productDTO, Long userId) {
        Category category = categoryRepository.findById(productDTO.getCate().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", "Id", productDTO.getCate().toString()));

        Product product = modelMapper.map(productDTO, Product.class);
        product.setCategory(category);
        product.setUserId(userId);

        Product savedProduct = productRepository.save(product);
        Integer numOfVariants = savedProduct.getVariants().size();
        return ProductRowDTO.builder().id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .category(modelMapper.map(product.getCategory(), CategoryDTO.class))
                .imageUrl(!product.getImages().isEmpty() ? product.getImages().get(0).getImageUrl() : "placehold.co/600x400")
                .status(product.getStatus())
                .variants(numOfVariants).build();
    }


    @Override
    public ProductDTO getProductById(Long productId) {
        Product p = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "ProductId", productId));

        ProductDTO productDTO = modelMapper.map(p, ProductDTO.class);
        productDTO.setCate(modelMapper.map(p.getCategory(), CategoryDTO.class));
        return productDTO;
    }

    @Override
    public ProductDTO updateProduct(Long productId, ProductDTO productDTO) {
        Product productFromDb = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "Id", productId));

        modelMapper.map(productDTO, productFromDb);
        Product savedProduct = productRepository.save(productFromDb);

        return modelMapper.map(savedProduct, ProductDTO.class);
    }

    @Override
    public ProductDTO deleteProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));

//        cartServiceClient.deleteProductFromCart(modelMapper.map(product, ProductDTO.class));

        productRepository.delete(product);
        return modelMapper.map(product, ProductDTO.class);
    }

    @Override
    public ProductResponse getAllProductsForSeller(Integer page, Integer perPage, String name, String category, String sortBy, String sortOrder, Long userId) {
        Sort sort = sortOrder.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, perPage, sort);

        Specification<Product> spec = Specification.allOf(ProductUtils.userIdEquals(userId))
                .and(ProductUtils.nameContains(name))
                .and(ProductUtils.categoryEquals(category));

        return getProducts(spec, pageable);
    }

    private ProductResponse getProducts(Specification<Product> spec, Pageable pageable) {
        Page<Product> pageProducts = productRepository.findAll(spec, pageable);
        System.out.println(pageProducts.getContent());
        List<ProductRowDTO> productRowDTOS = pageProducts.getContent().stream()
                .map(product -> {
                    Integer numOfVariants = product.getVariants().size();
                    return ProductRowDTO.builder()
                            .id(product.getId())
                            .name(product.getName())
                            .description(product.getDescription())
                            .category(modelMapper.map(product.getCategory(), CategoryDTO.class))
                            .imageUrl(!product.getImages().isEmpty() ? product.getImages().get(0).getImageUrl() : "placehold.co/600x400")
                            .status(product.getStatus())
                            .variants(numOfVariants)
                            .build();
                })
                .toList();

        ProductResponse response = new ProductResponse();

        response.setContent(productRowDTOS);
        response.setPageNumber(pageProducts.getNumber());
        response.setPageSize(pageProducts.getSize());
        response.setTotalElements(pageProducts.getTotalElements());
        response.setTotalPages(pageProducts.getTotalPages());
        response.setLastPage(pageProducts.isLast());

        return response;
    }

    @Override
    public ProductResponse getAllPublicProducts(Integer page, Integer perPage, String category, String search, String sortBy, String sortOrder) {
        Sort sort = sortOrder.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, perPage, sort);

        // Only show ACTIVE products for public
        Specification<Product> spec = Specification.where(ProductUtils.statusEquals("ACTIVE"))
                .and(ProductUtils.nameContains(search))
                .and(ProductUtils.categoryEquals(category));

        return getProducts(spec, pageable);
    }

    @Override
    public ProductDTO getPublicProductById(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "ProductId", productId));

        // Only return if product is ACTIVE
        if (!"ACTIVE".equals(product.getStatus())) {
            throw new ResourceNotFoundException("Product", "ProductId", productId);
        }

        ProductDTO productDTO = modelMapper.map(product, ProductDTO.class);
        productDTO.setCate(modelMapper.map(product.getCategory(), CategoryDTO.class));
        return productDTO;
    }
}
