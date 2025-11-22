package com.ecom.order.seeder;

import com.ecom.order.entity.*;
import com.ecom.order.repositories.*;
import com.github.javafaker.Faker;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
@Profile("!test")
@Order(3) // Run after User and Product seeders
public class FakeDataSeeder implements CommandLineRunner {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final PaymentRepository paymentRepository;

    private final Faker faker = new Faker();

    @Override
    @Transactional
    public void run(String... args) {
        if (orderRepository.count() > 20) {
            log.info("Database already seeded with orders. Skipping order seeding.");
            return;
        }

        log.info("Starting Order service fake data seeding...");

        // Seed Carts (for users 1-50)
        seedCarts(50);

        // Seed Orders (historical orders)
        seedOrders(100);

        log.info("Order service fake data seeding completed!");
    }

    private void seedCarts(int count) {
        log.info("Seeding {} carts...", count);

        List<Cart> carts = new ArrayList<>();

        for (int i = 1; i <= count; i++) {
            Cart cart = new Cart();
            cart.setUserId((long) i);
            cart.setTotalPrice(0.0);
            carts.add(cart);
        }

        carts = cartRepository.saveAll(carts);
        log.info("✓ Created {} carts", carts.size());

        // Add cart items
        seedCartItems(carts);
    }

    private void seedCartItems(List<Cart> carts) {
        log.info("Seeding cart items...");

        List<CartItem> cartItems = new ArrayList<>();

        for (Cart cart : carts) {
            int itemCount = faker.number().numberBetween(0, 6);
            double totalPrice = 0.0;

            for (int i = 0; i < itemCount; i++) {
                CartItem item = new CartItem();
                item.setCart(cart);
                item.setProductId((long) faker.number().numberBetween(1, 150));
                item.setQuantity(faker.number().numberBetween(1, 5));
                item.setProductPrice(faker.number().randomDouble(2, 10, 500));
                item.setDiscount(faker.number().randomDouble(2, 0, 20));

                totalPrice += (item.getProductPrice() - item.getDiscount()) * item.getQuantity();
                cartItems.add(item);
            }

            cart.setTotalPrice(totalPrice);
        }

        cartItemRepository.saveAll(cartItems);
        cartRepository.saveAll(carts);
        log.info("✓ Created {} cart items", cartItems.size());
    }

    private void seedOrders(int count) {
        log.info("Seeding {} orders...", count);

        List<com.ecom.order.entity.Order> orders = new ArrayList<>();
        List<OrderItem> orderItems = new ArrayList<>();
        List<Payment> payments = new ArrayList<>();

        for (int i = 0; i < count; i++) {
            // Create order
            com.ecom.order.entity.Order order = new com.ecom.order.entity.Order();
            order.setEmail(faker.internet().emailAddress());
            order.setOrderDate(LocalDate.ofInstant(
                    faker.date().past(365, java.util.concurrent.TimeUnit.DAYS).toInstant(),
                    ZoneId.systemDefault()
            ));
            order.setOrderStatus(faker.options().option("PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"));
            order.setAddressId((long) faker.number().numberBetween(1, 200));

            // Create order items
            int itemCount = faker.number().numberBetween(1, 5);
            double totalAmount = 0.0;

            List<OrderItem> currentOrderItems = new ArrayList<>();
            for (int j = 0; j < itemCount; j++) {
                OrderItem item = new OrderItem();
                item.setOrder(order);
                item.setProductId((long) faker.number().numberBetween(1, 150));
                item.setQuantity(faker.number().numberBetween(1, 4));
                item.setOrderedProductPrice(faker.number().randomDouble(2, 10, 500));
                item.setDiscount(faker.number().randomDouble(2, 0, 20));

                totalAmount += (item.getOrderedProductPrice() - item.getDiscount()) * item.getQuantity();
                currentOrderItems.add(item);
            }

            order.setTotalAmount(totalAmount);
            order.setOrderItems(currentOrderItems);

            // Create payment
            Payment payment = new Payment();
            payment.setPaymentMethod(faker.options().option("CREDIT_CARD", "DEBIT_CARD", "PAYPAL", "CASH_ON_DELIVERY"));
            payment.setPgPaymentId("PAY-" + faker.number().digits(10));
            payment.setPgStatus(faker.options().option("SUCCESS", "PENDING", "FAILED"));
            payment.setPgResponseMessage(faker.lorem().sentence());
            payment.setPgName(faker.options().option("Stripe", "PayPal", "Razorpay", "Cash"));
            payment.setOrder(order);

            order.setPayment(payment);

            orders.add(order);
            orderItems.addAll(currentOrderItems);
            payments.add(payment);
        }

        // Save in order: orders, order items, payments
        orderRepository.saveAll(orders);
        log.info("✓ Created {} orders", orders.size());
        log.info("✓ Created {} order items", orderItems.size());
        log.info("✓ Created {} payments", payments.size());
    }
}
