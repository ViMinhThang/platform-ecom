//package com.ecom.product;
//
//import com.ecom.product.entity.*;
//import com.ecom.product.repository.*;
//import lombok.RequiredArgsConstructor;
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.stereotype.Component;
//
//import java.math.BigDecimal;
//import java.time.LocalDateTime;
//import java.util.List;
//import java.util.Map;
//
//@Component
//@RequiredArgsConstructor
//public class DataSeeder implements CommandLineRunner {
//
//    private final CategoryRepository categoryRepo;
//    private final ProductRepository productRepo;
//    private final ProductOptionRepository optionRepo;
//    private final ProductOptionValueRepository optionValueRepo;
//    private final ProductVariantRepository variantRepo;
//    private final ProductImageRepository imageRepo;
//    private final VariantOptionValueRepository variantOptionValueRepository;
//
//    @Override
//    public void run(String... args) {
//        if (productRepo.count() > 0) return;
//
//        // CATEGORY
//        Category cat = categoryRepo.save(Category.builder()
//                .name("Thời trang nam")
//                .createdAt(LocalDateTime.now())
//                .updatedAt(LocalDateTime.now())
//                .imageUrl("a92c7a1e-65b7-4f42-b44b-ff6f84b76bf7_background.jpg")
//                .build());
//
//        // PRODUCT
//        Product product = Product.builder()
//                .name("Áo thun nam cổ tròn")
//                .slug("ao-thun-nam-co-tron")
//                .description("Áo thun cotton 100% co giãn thoáng mát.")
//                .category(cat)
//                .userId(1L)
//                .status("ACTIVE")
//                .specifications(Map.of("chất_liệu", "Cotton 100%", "xuất_xứ", "Việt Nam"))
//                .metadata(Map.of("tags", List.of("áo thun", "nam", "cotton"), "rating", 4.8))
//                .totalSold(1250L)
//                .totalReviews(320L)
//                .averageRating(4.8)
//                .build();
//        productRepo.save(product);
//
//        // OPTIONS
//        ProductOption colorOpt = optionRepo.save(ProductOption.builder()
//                .name("color")
//                .displayName("Màu sắc")
//                .product(product)
//                .isRequired(true)
//                .sortOrder(1)
//                .build());
//
//        ProductOption sizeOpt = optionRepo.save(ProductOption.builder()
//                .name("size")
//                .displayName("Kích cỡ")
//                .isRequired(true)
//                .sortOrder(2)
//                .product(product)
//                .build());
//
//        product.setOptions(List.of(colorOpt, sizeOpt));
//
//        // OPTION VALUES
//        ProductOptionValue red = optionValueRepo.save(ProductOptionValue.builder()
//                .option(colorOpt).value("red").displayValue("Đỏ").sortOrder(0).build());
//        ProductOptionValue blue = optionValueRepo.save(ProductOptionValue.builder()
//                .option(colorOpt).value("blue").displayValue("Xanh").sortOrder(0).build());
//        ProductOptionValue m = optionValueRepo.save(ProductOptionValue.builder()
//                .option(sizeOpt).value("M").displayValue("Size M").sortOrder(0).build());
//        ProductOptionValue l = optionValueRepo.save(ProductOptionValue.builder()
//                .option(sizeOpt).value("L").displayValue("Size L").sortOrder(0).build());
//
//
//        // VARIANTS
//        ProductVariant v1 = variantRepo.save(ProductVariant.builder()
//                .product(product)
//                .sku("SKU-RED-M")
//                .price(BigDecimal.valueOf(199000))
//                .stock(20)
//                .isActive(true)
//                .build());
//
//        ProductVariant v2 = variantRepo.save(ProductVariant.builder()
//                .product(product)
//                .sku("SKU-RED-L")
//                .price(BigDecimal.valueOf(199000))
//                .stock(15)
//                .isActive(true)
//                .build());
//
//        ProductImage img = ProductImage.builder()
//                .product(product)
//                .imageUrl("1762084687965_background.jpg")
//                .build();
//
//        VariantOptionValue variantOptionValue = variantOptionValueRepository.save(VariantOptionValue.builder().variant(v1).optionValue(red).build());
//        VariantOptionValue variantOptionValue1 = variantOptionValueRepository.save(VariantOptionValue.builder().variant(v1).optionValue(m).build());
//        VariantOptionValue variantOptionValue2 = variantOptionValueRepository.save(VariantOptionValue.builder().variant(v2).optionValue(blue).build());
//        VariantOptionValue variantOptionValue3 = variantOptionValueRepository.save(VariantOptionValue.builder().variant(v2).optionValue(l).build());
//        imageRepo.save(img);
//    }
//}
