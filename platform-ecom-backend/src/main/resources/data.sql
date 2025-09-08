-- Category sample
INSERT INTO categories (category_id, category_name) VALUES (1, 'Smartphones');
INSERT INTO categories (category_id, category_name) VALUES (2, 'Laptops');
INSERT INTO categories (category_id, category_name) VALUES (3, 'Accessories');

-- Roles
INSERT INTO roles (role_id, role_name) VALUES (1, 'ROLE_USER');
INSERT INTO roles (role_id, role_name) VALUES (2, 'ROLE_SELLER');
INSERT INTO roles (role_id, role_name) VALUES (3, 'ROLE_ADMIN');

-- Users (sellers)
INSERT INTO users (user_id, username, email, password) VALUES (1, 'Seller A', 'sellerA@example.com', 'password123');
INSERT INTO users (user_id, username, email, password) VALUES (2, 'Seller B', 'sellerB@example.com', 'password123');

-- Products
INSERT INTO products (product_id, product_name, image, description, quantity, price, discount, special_price, category_id, seller_id)
VALUES (1, 'iPhone 15 Pro Max', 'https://placehold.co/600x400',
        'Latest Apple flagship smartphone with A17 Bionic chip',
        50, 1299.99, 10, 1169.99, 1, 1);

INSERT INTO products (product_id, product_name, image, description, quantity, price, discount, special_price, category_id, seller_id)
VALUES (2, 'Samsung Galaxy S24 Ultra', 'https://placehold.co/600x400',
        'Premium Samsung smartphone with Snapdragon Gen 3',
        40, 1199.99, 12, 1055.99, 1, 2);

INSERT INTO products (product_id, product_name, image, description, quantity, price, discount, special_price, category_id, seller_id)
VALUES (3, 'MacBook Pro 16', 'https://placehold.co/600x400',
        'Apple MacBook Pro with M3 Max chip',
        20, 2499.99, 8, 2299.99, 2, 1);

INSERT INTO products (product_id, product_name, image, description, quantity, price, discount, special_price, category_id, seller_id)
VALUES (4, 'Logitech MX Master 3S', 'https://placehold.co/600x400',
        'Ergonomic wireless mouse with advanced features',
        100, 99.99, 15, 84.99, 3, 2);
