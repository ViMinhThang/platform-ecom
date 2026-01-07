package com.ecom.product.seeder;

import com.ecom.product.entity.*;
import com.ecom.product.repository.*;
import com.github.javafaker.Faker;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
@Profile("!test")
@Order(2) // Run after User seeder
public class FakeDataSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final ProductOptionRepository productOptionRepository;
    private final ProductOptionValueRepository productOptionValueRepository;
    private final ProductVariantRepository productVariantRepository;
    private final ProductImageRepository productImageRepository;
    private final VariantOptionValueRepository variantOptionValueRepository;

    private final Faker faker = new Faker();

    @Override
    @Transactional
    public void run(String... args) {
        if (productRepository.count() > 200) {
            log.info("Database already seeded with products. Skipping product seeding.");
            return;
        }

        log.info("Starting Product service fake data seeding...");

        List<Category> categories = seedCategories();
        seedProducts(categories, 150);

        log.info("Product service fake data seeding completed!");
    }

    private List<Category> seedCategories() {
        if (categoryRepository.count() > 5) {
            log.info("Categories already exist, skipping category seeding");
            return categoryRepository.findAll();
        }

        log.info("Seeding categories...");
        String[] categoryNames = {
                "Electronics", "Fashion", "Home & Garden", "Sports & Outdoors",
                "Beauty & Health", "Toys & Hobbies", "Automotive", "Books",
                "Groceries", "Pet Supplies", "Office Supplies", "Jewelry"
        };

        List<Category> categories = new ArrayList<>();
        for (String name : categoryNames) {
            Category category = Category.builder()
                    .name(name)
                    .imageUrl("1.png")
                    .build();
            categories.add(category);
        }

        categories = categoryRepository.saveAll(categories);
        log.info("✓ Created {} categories", categories.size());
        return categories;
    }

    private void seedProducts(List<Category> categories, int count) {
        log.info("Seeding {} products...", count);

        List<Product> products = new ArrayList<>();

        for (int i = 0; i < count; i++) {
            Category randomCategory = categories.get(faker.number().numberBetween(0,
                    categories.size()));

            String productName = generateProductName(randomCategory.getName());
            Product product = Product.builder()
                    .name(productName)
                    .slug(productName.toLowerCase().replaceAll("[^a-z0-9]+", "-")
                            + "-" + faker.number().digits(5))
                    .description(faker.lorem().paragraph(3))
                    .category(randomCategory)
                    .userId((long) faker.number().numberBetween(1, 100))
                    .totalSold(1250L)
                    .totalReviews(320L)
                    .averageRating(4.8)
                    .status(faker.options().option("ACTIVE", "ACTIVE", "ACTIVE", "DRAFT",
                            "OUT_OF_STOCK"))
                    .specifications(generateSpecifications())
                    .metadata(generateMetadata())
                    .build();

            products.add(product);
        }

        products = productRepository.saveAll(products);
        log.info("✓ Created {} products", products.size());

        // Add options, variants, and images to products
        for (Product product : products) {
            addProductOptions(product);
            addProductImages(product, faker.number().numberBetween(2, 6));
        }

        log.info("✓ Added options, variants, and images to products");
    }

    private String generateProductName(String categoryName) {
        switch (categoryName) {
            case "Electronics":
                return faker.options().option(
                        "Wireless Headphones", "Smart Watch", "Laptop", "4K TV",
                        "Bluetooth Speaker", "Gaming Mouse", "USB-C Cable", "Power Bank") + " "
                        + faker.commerce().productName();
            case "Fashion":
                return faker.options().option(
                        "Cotton T-Shirt", "Denim Jeans", "Leather Jacket", "Running Shoes",
                        "Dress", "Sweater", "Shorts", "Sneakers") + " " + faker.color().name();
            case "Home & Garden":
                return faker.options().option(
                        "Coffee Maker", "Vacuum Cleaner", "Garden Tools", "Sofa",
                        "Lamp", "Rug", "Curtains", "Planter") + " " + faker.commerce().productName();
            case "Sports & Outdoors":
                return faker.options().option(
                        "Yoga Mat", "Tennis Racket", "Camping Tent", "Dumbbell Set",
                        "Bicycle", "Hiking Backpack", "Water Bottle", "Running Shoes") + " "
                        + faker.commerce().productName();
            default:
                return faker.commerce().productName();
        }
    }

    private Map<String, Object> generateSpecifications() {
        Map<String, Object> specs = new HashMap<>();
        specs.put("material", faker.options().option("Plastic", "Metal", "Wood",
                "Glass", "Cotton", "Leather"));
        specs.put("brand", faker.company().name());
        specs.put("weight", faker.number().randomDouble(2, 0, 10) + " kg");
        specs.put("warranty", faker.number().numberBetween(1, 3) + " years");
        return specs;
    }

    private Map<String, Object> generateMetadata() {
        Map<String, Object> metadata = new HashMap<>();
        metadata.put("rating", faker.number().randomDouble(1, 3, 5));
        metadata.put("reviewCount", faker.number().numberBetween(0, 500));
        metadata.put("featured", faker.bool().bool());
        return metadata;
    }

    private void addProductOptions(Product product) {
        // Create Color option
        ProductOption colorOption = ProductOption.builder()
                .product(product)
                .name("color")
                .displayName("Color")
                .isRequired(true)
                .sortOrder(1)
                .build();
        colorOption = productOptionRepository.save(colorOption);

        // Create Size option
        ProductOption sizeOption = ProductOption.builder()
                .product(product)
                .name("size")
                .displayName("Size")
                .isRequired(true)
                .sortOrder(2)
                .build();
        sizeOption = productOptionRepository.save(sizeOption);

        // Create option values
        String[] colors = { "Red", "Blue", "Black", "White", "Green" };
        String[] sizes = { "S", "M", "L", "XL" };

        List<ProductOptionValue> colorValues = new ArrayList<>();
        for (int i = 0; i < Math.min(3, colors.length); i++) {
            String color = colors[faker.number().numberBetween(0, colors.length)];
            ProductOptionValue value = ProductOptionValue.builder()
                    .option(colorOption)
                    .value(color.toLowerCase())
                    .displayValue(color)
                    .sortOrder(i)
                    .build();
            colorValues.add(productOptionValueRepository.save(value));
        }

        List<ProductOptionValue> sizeValues = new ArrayList<>();
        for (int i = 0; i < Math.min(3, sizes.length); i++) {
            String size = sizes[faker.number().numberBetween(0, sizes.length)];
            ProductOptionValue value = ProductOptionValue.builder()
                    .option(sizeOption)
                    .value(size)
                    .displayValue("Size " + size)
                    .sortOrder(i)
                    .build();
            sizeValues.add(productOptionValueRepository.save(value));
        }

        // Create variants (combinations of options)
        for (ProductOptionValue colorValue : colorValues) {
            for (ProductOptionValue sizeValue : sizeValues) {
                BigDecimal price = BigDecimal.valueOf(faker.number().randomDouble(2, 10,
                        1000));
                boolean hasDiscount = faker.bool().bool(); // 50% chance of discount

                ProductVariant variant = ProductVariant.builder()
                        .product(product)
                        .sku(generateSku(product))
                        .price(price)
                        .stock(faker.number().numberBetween(0, 100))
                        .totalSold(faker.number().numberBetween(0, 500))
                        .isActive(true)
                        .imageUrl("2.png")
                        .build();
                variant = productVariantRepository.save(variant);

                // Link variant to option values
                variantOptionValueRepository.save(
                        VariantOptionValue.builder()
                                .variant(variant)
                                .optionValue(colorValue)
                                .build());
                variantOptionValueRepository.save(
                        VariantOptionValue.builder()
                                .variant(variant)
                                .optionValue(sizeValue)
                                .build());
            }
        }
    }

    private void addProductImages(Product product, int count) {
        for (int i = 0; i < count; i++) {
            ProductImage image = ProductImage.builder()
                    .product(product)
                    .imageUrl("1.png")
                    .build();
            productImageRepository.save(image);
        }
    }

    private String generateSku(Product product) {
        return "SKU-" + product.getId() + "-" + faker.number().digits(6);
    }
}
