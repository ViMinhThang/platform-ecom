-- ========================================
-- Migration Script: Big Bang Migration
-- ========================================
-- Run this AFTER inventory_db and schema are created
-- and AFTER inventory-service is deployed

-- Copy stock from product_db.product_variants to inventory_db.inventory
INSERT INTO inventory_db.public.inventory (
    product_id, 
    variant_id, 
    sku, 
    available_stock, 
    total_stock,
    reserved_stock,
    low_stock_threshold,
    version,
    created_at,
    updated_at
)
SELECT 
    pv.product_id,
    pv.id AS variant_id,
    pv.sku,
    pv.stock AS available_stock,
    pv.stock AS total_stock,
    0 AS reserved_stock,
    10 AS low_stock_threshold,
    0 AS version,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM product_db.public.product_variants pv
ON CONFLICT (variant_id) DO NOTHING;

-- Record migration transactions
INSERT INTO inventory_db.public.inventory_transactions (
    inventory_id,
    type,
    quantity_change,
    stock_before,
    stock_after,
    reference_type,
    reason,
    created_at
)
SELECT 
    i.id,
    'INITIAL',
    i.total_stock,
    0,
    i.total_stock,
    'MIGRATION',
    'Initial stock migration from product_variants',
    CURRENT_TIMESTAMP
FROM inventory_db.public.inventory i
WHERE i.total_stock > 0;
