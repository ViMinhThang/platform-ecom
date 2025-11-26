package com.ecom.review.seeder;

import com.ecom.review.entity.Review;
import com.ecom.review.repository.ReviewRepository;
import com.github.javafaker.Faker;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;
import java.util.concurrent.TimeUnit;

@Component
@RequiredArgsConstructor
@Slf4j
@Profile("!test")
@Order(4) // Run after User, Product, and Order seeders
public class FakeDataSeeder implements CommandLineRunner {

    private final ReviewRepository reviewRepository;
    private final Faker faker = new Faker();

    @Override
    @Transactional
    public void run(String... args) {
        if (reviewRepository.count() > 50) {
            log.info("Database already seeded with reviews. Skipping review seeding.");
            return;
        }

        log.info("Starting Review service fake data seeding...");

        seedReviews(200);

        log.info("Review service fake data seeding completed!");
    }

    private void seedReviews(int count) {
        log.info("Seeding {} reviews...", count);

        List<Review> reviews = new ArrayList<>();
        Set<String> uniqueReviewKeys = new HashSet<>(); // To ensure unique user-product combinations

        int attempts = 0;
        int maxAttempts = count * 3; // Allow more attempts to reach target count

        while (reviews.size() < count && attempts < maxAttempts) {
            attempts++;

            // Random user (assuming users 1-100 exist)
            Long userId = (long) faker.number().numberBetween(1, 101);
            
            Long productId = (long) faker.number().numberBetween(1, 151);
            
            String uniqueKey = userId + "-" + productId;

            // Skip if this combination already exists
            if (uniqueReviewKeys.contains(uniqueKey)) {
                continue;
            }

            // Random order (assuming orders exist)
            Long orderId = (long) faker.number().numberBetween(1, 101);
            
            // Generate email (matches user pattern)
            String email = "user" + userId + "@ecom.com";

            Review review = new Review();
            review.setProductId(productId);
            review.setUserId(userId);
            review.setOrderId(orderId);
            review.setEmail(email);

            // Rating between 1-5, weighted towards higher ratings
            int rating = generateWeightedRating();
            review.setRating(rating);

            // Generate review title and comment
            review.setTitle(generateReviewTitle(rating));
            review.setComment(generateReviewComment(rating));
            // 30% chance to have images
            if (faker.number().numberBetween(1, 100) <= 30) {
                review.setImages(generateReviewImages());
            } else {
                review.setImages(new ArrayList<>());
            }

            // Most reviews are verified purchases
            review.setVerifiedPurchase(faker.number().numberBetween(1, 100) <= 85);

            // Random helpful/not helpful counts
            review.setHelpfulCount(faker.number().numberBetween(0, 50));
            review.setNotHelpfulCount(faker.number().numberBetween(0, 15));

            // Most reviews are approved
            review.setStatus(faker.options().option("APPROVED", "APPROVED", "APPROVED", "PENDING", "REJECTED"));

            // Set sentiment based on rating
            review.setSentiment(calculateSentiment(rating));

            // Random creation date within last 6 months
            LocalDateTime createdAt = LocalDateTime.ofInstant(
                    faker.date().past(180, TimeUnit.DAYS).toInstant(),
                    ZoneId.systemDefault()
            );
            review.setCreatedAt(createdAt);
            review.setUpdatedAt(createdAt);

            reviews.add(review);
            uniqueReviewKeys.add(uniqueKey);
        }

        reviewRepository.saveAll(reviews);
        log.info("✓ Created {} reviews", reviews.size());
    }

    private int generateWeightedRating() {
        // Weight towards higher ratings (more realistic distribution)
        int random = faker.number().numberBetween(1, 100);
        if (random <= 50) return 5;  // 50% - 5 stars
        if (random <= 75) return 4;  // 25% - 4 stars
        if (random <= 90) return 3;  // 15% - 3 stars
        if (random <= 97) return 2;  //  7% - 2 stars
        return 1;                     //  3% - 1 star
    }

    private String generateReviewTitle(int rating) {
        if (rating >= 4) {
            return faker.options().option(
                    "Excellent product!",
                    "Highly recommended",
                    "Great quality",
                    "Very satisfied",
                    "Love it!",
                    "Amazing purchase",
                    "Worth every penny",
                    "Exceeded expectations",
                    "Perfect!",
                    "Fantastic product"
            );
        } else if (rating == 3) {
            return faker.options().option(
                    "It's okay",
                    "Decent product",
                    "Average quality",
                    "Could be better",
                    "Fair purchase",
                    "Nothing special",
                    "Acceptable"
            );
        } else {
            return faker.options().option(
                    "Disappointed",
                    "Not as expected",
                    "Poor quality",
                    "Would not recommend",
                    "Below expectations",
                    "Not satisfied",
                    "Waste of money"
            );
        }
    }

    private String generateReviewComment(int rating) {
        if (rating >= 4) {
            return faker.options().option(
                    faker.lorem().sentence(15),
                    "This product is amazing! The quality is excellent and it arrived quickly. Highly recommend to anyone looking for a great product.",
                    "Very impressed with the quality. Exactly as described and even better in person. Will definitely buy again!",
                    "Great value for money. The product works perfectly and the customer service was excellent.",
                    "I love this product! It's exactly what I was looking for. Fast shipping and great packaging too.",
                    "Absolutely fantastic! Exceeded my expectations in every way. Would give 6 stars if I could.",
                    "Best purchase I've made in a while. Quality is top-notch and it does exactly what it's supposed to do.",
                    "Really happy with this purchase. Good quality, fair price, and fast delivery. What more could you ask for?"
            );
        } else if (rating == 3) {
            return faker.options().option(
                    faker.lorem().sentence(12),
                    "The product is okay, but nothing special. It works as advertised but I expected a bit more quality.",
                    "Decent product for the price. Does the job but could be better. Shipping was a bit slow.",
                    "It's fine. Not the best quality but not terrible either. You get what you pay for.",
                    "Average product. Works as expected but nothing impressive. Might look for alternatives next time."
            );
        } else {
            return faker.options().option(
                    faker.lorem().sentence(10),
                    "Very disappointed with this purchase. The quality is much lower than expected. Would not recommend.",
                    "Not worth the money. The product arrived damaged and customer service was unhelpful.",
                    "Poor quality materials. Broke after just a few uses. Save your money and buy something else.",
                    "Does not match the description at all. Very misleading. Requesting a refund."
            );
        }
    }

    private List<String> generateReviewImages() {
        int imageCount = faker.number().numberBetween(1, 4);
        List<String> images = new ArrayList<>();
        
        for (int i = 0; i < imageCount; i++) {
            images.add("1.png");
            images.add("2.png");
            images.add("3.png");

        }
        
        return images;
    }

    private String calculateSentiment(int rating) {
        if (rating >= 4) {
            return "POSITIVE";
        } else if (rating == 3) {
            return "NEUTRAL";
        } else {
            return "NEGATIVE";
        }
    }
}
