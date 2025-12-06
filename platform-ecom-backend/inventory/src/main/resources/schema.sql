-- ========================================
-- Inventory Service Database Schema
-- ========================================

-- Create inventory database
-- Run this first: CREATE DATABASE inventory_db;

-- Connect to inventory_db before running the rest
-- \c inventory_db;

-- ========================================
-- Main Inventory Table
-- ========================================
CREATE TABLE IF NOT EXISTS inventory (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL,
    variant_id BIGINT NOT NULL UNIQUE,
    sku VARCHAR(100),
    available_stock INT NOT NULL DEFAULT 0,
    reserved_stock INT NOT NULL DEFAULT 0,
    total_stock INT NOT NULL DEFAULT 0,
    low_stock_threshold INT DEFAULT 10,
    reorder_point INT DEFAULT 5,
    reorder_quantity INT DEFAULT 50,
    track_inventory BOOLEAN DEFAULT TRUE,
    version BIGINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_inventory_variant ON inventory(variant_id);
CREATE INDEX idx_inventory_product ON inventory(product_id);
CREATE INDEX idx_inventory_sku ON inventory(sku);

-- ========================================
-- Inventory Transactions (Audit Trail)
-- ========================================
CREATE TABLE IF NOT EXISTS inventory_transactions (
    id BIGSERIAL PRIMARY KEY,
    inventory_id BIGINT NOT NULL REFERENCES inventory(id),
    type VARCHAR(20) NOT NULL,
    quantity_change INT NOT NULL,
    stock_before INT NOT NULL,
    stock_after INT NOT NULL,
    reference_type VARCHAR(50),
    reference_id VARCHAR(100),
    reason TEXT,
    performed_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_transaction_inventory ON inventory_transactions(inventory_id);
CREATE INDEX idx_transaction_type ON inventory_transactions(type);
CREATE INDEX idx_transaction_created ON inventory_transactions(created_at);

-- ========================================
-- Stock Reservations (Checkout Holds)
-- ========================================
CREATE TABLE IF NOT EXISTS stock_reservations (
    id BIGSERIAL PRIMARY KEY,
    inventory_id BIGINT NOT NULL REFERENCES inventory(id),
    cart_id BIGINT,
    user_id BIGINT,
    quantity INT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    reserved_at TIMESTAMP,
    expires_at TIMESTAMP,
    confirmed_at TIMESTAMP,
    cancelled_at TIMESTAMP
);

CREATE INDEX idx_reservation_inventory ON stock_reservations(inventory_id);
CREATE INDEX idx_reservation_status ON stock_reservations(status);
CREATE INDEX idx_reservation_expires ON stock_reservations(expires_at);
CREATE INDEX idx_reservation_cart ON stock_reservations(cart_id);
