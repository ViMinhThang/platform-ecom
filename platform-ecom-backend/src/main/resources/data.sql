-- Category sample
INSERT INTO categories (category_id, category_name) VALUES (1, 'shoes');
INSERT INTO categories (category_id, category_name) VALUES (2, 'clothing');
INSERT INTO categories (category_id, category_name) VALUES (3, 'accessories');

-- Roles
INSERT INTO roles (role_id, role_name) VALUES (1, 'ROLE_USER');
INSERT INTO roles (role_id, role_name) VALUES (2, 'ROLE_ADMIN');

-- Users (sellers)
INSERT INTO users (user_id, username, email, password) VALUES (1, 'Admin A', 'AdminA@example.com', 'password123');
INSERT INTO users (user_id, username, email, password) VALUES (2, 'Admin B', 'AdminB@example.com', 'password123');

-- Products
-- Electronics
-- Electronics
INSERT INTO products (product_id, product_name, slug, image, description, quantity, price, discount, special_price, category_id)
VALUES (5, 'Sony WH-1000XM5 Headphones', 'sony-wh-1000xm5-headphones', 'https://placehold.co/600x400',
        'Noise-cancelling wireless headphones with premium sound',
        70, 399.99, 20, 319.99, 1);

INSERT INTO products (product_id, product_name, slug, image, description, quantity, price, discount, special_price, category_id)
VALUES (6, 'Apple iPad Pro 12.9', 'apple-ipad-pro-12-9', 'https://placehold.co/600x400',
        'Powerful iPad with M2 chip and Liquid Retina display',
        30, 1099.99, 5, 1044.99, 1);

-- Sports
INSERT INTO products (product_id, product_name, slug, image, description, quantity, price, discount, special_price, category_id)
VALUES (7, 'Nike Air Zoom Pegasus 40', 'nike-air-zoom-pegasus-40', 'https://placehold.co/600x400',
        'Lightweight running shoes with responsive cushioning',
        80, 129.99, 10, 116.99, 2);

INSERT INTO products (product_id, product_name, slug, image, description, quantity, price, discount, special_price, category_id)
VALUES (8, 'Adidas Predator Soccer Ball', 'adidas-predator-soccer-ball', 'https://placehold.co/600x400',
        'Professional-grade soccer ball for training and matches',
        150, 49.99, 15, 42.49, 2);

INSERT INTO products (product_id, product_name, slug, image, description, quantity, price, discount, special_price, category_id)
VALUES (9, 'Wilson Pro Staff Tennis Racket', 'wilson-pro-staff-tennis-racket', 'https://placehold.co/600x400',
        'High-performance racket for advanced players',
        40, 249.99, 12, 219.99, 2);

-- Clothing
INSERT INTO products (product_id, product_name, slug, image, description, quantity, price, discount, special_price, category_id)
VALUES (10, 'Levi’s 501 Original Jeans', 'levis-501-original-jeans', 'https://placehold.co/600x400',
        'Classic straight-leg jeans with durable denim',
        100, 89.99, 10, 80.99, 3);

INSERT INTO products (product_id, product_name, slug, image, description, quantity, price, discount, special_price, category_id)
VALUES (11, 'Uniqlo Ultra Light Down Jacket', 'uniqlo-ultra-light-down-jacket', 'https://placehold.co/600x400',
        'Warm yet lightweight puffer jacket for winter',
        60, 149.99, 20, 119.99, 3);

INSERT INTO products (product_id, product_name, slug, image, description, quantity, price, discount, special_price, category_id)
VALUES (12, 'Nike Dri-FIT Training T-Shirt', 'nike-dri-fit-training-t-shirt', 'https://placehold.co/600x400',
        'Breathable and sweat-wicking T-shirt for workouts',
        200, 34.99, 15, 29.74, 3);
