-- Sale Campaign Tables Migration
-- Creates new tables for the Sale Campaign feature

-- Main sale campaigns table
CREATE TABLE IF NOT EXISTS sale_campaigns (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    banner_url VARCHAR(500),
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sale campaign categories (many-to-many join table)
CREATE TABLE IF NOT EXISTS sale_campaign_categories (
    id BIGSERIAL PRIMARY KEY,
    sale_campaign_id BIGINT NOT NULL REFERENCES sale_campaigns(id) ON DELETE CASCADE,
    category_id BIGINT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_sale_campaign_category UNIQUE (sale_campaign_id, category_id)
);

-- Sale campaign discount tiers
CREATE TABLE IF NOT EXISTS sale_campaign_discount_tiers (
    id BIGSERIAL PRIMARY KEY,
    sale_campaign_id BIGINT NOT NULL REFERENCES sale_campaigns(id) ON DELETE CASCADE,
    min_price DECIMAL(12, 2) NOT NULL,
    max_price DECIMAL(12, 2) NOT NULL,
    discount_percent INTEGER NOT NULL,
    sort_order INTEGER DEFAULT 0
);

-- Sale campaign items (generated on activation)
CREATE TABLE IF NOT EXISTS sale_campaign_items (
    id BIGSERIAL PRIMARY KEY,
    sale_campaign_id BIGINT NOT NULL REFERENCES sale_campaigns(id) ON DELETE CASCADE,
    variant_id BIGINT NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
    sale_price DECIMAL(10, 2) NOT NULL,
    discount_percent INTEGER NOT NULL,
    stock_limit INTEGER NOT NULL,
    sold_count INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    CONSTRAINT uk_sale_campaign_variant UNIQUE (sale_campaign_id, variant_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_sale_campaign_status ON sale_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_sale_campaign_start_time ON sale_campaigns(start_time);
CREATE INDEX IF NOT EXISTS idx_sale_campaign_end_time ON sale_campaigns(end_time);
CREATE INDEX IF NOT EXISTS idx_sale_campaign_slug ON sale_campaigns(slug);
CREATE INDEX IF NOT EXISTS idx_sale_campaign_deleted ON sale_campaigns(deleted);
CREATE INDEX IF NOT EXISTS idx_sale_campaign_category_campaign ON sale_campaign_categories(sale_campaign_id);
CREATE INDEX IF NOT EXISTS idx_sale_campaign_category_category ON sale_campaign_categories(category_id);
CREATE INDEX IF NOT EXISTS idx_sale_campaign_tier_campaign ON sale_campaign_discount_tiers(sale_campaign_id);
CREATE INDEX IF NOT EXISTS idx_sale_campaign_item_campaign ON sale_campaign_items(sale_campaign_id);
CREATE INDEX IF NOT EXISTS idx_sale_campaign_item_variant ON sale_campaign_items(variant_id);
