-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create product embeddings table
CREATE TABLE IF NOT EXISTS product_embeddings (
    product_id BIGINT PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    product_slug VARCHAR(255) NOT NULL,
    description TEXT,
    category_name VARCHAR(255),
    embedding vector(768),
    min_price DECIMAL(19,2),
    average_rating DOUBLE PRECISION,
    total_sold BIGINT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create IVFFlat index for fast approximate nearest neighbor search
-- Using cosine distance operator for similarity
CREATE INDEX IF NOT EXISTS idx_product_embeddings_vector 
ON product_embeddings 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Create index on product_slug for quick lookups
CREATE INDEX IF NOT EXISTS idx_product_embeddings_slug 
ON product_embeddings (product_slug);

-- Create index on updated_at for sync tracking
CREATE INDEX IF NOT EXISTS idx_product_embeddings_updated 
ON product_embeddings (updated_at);
