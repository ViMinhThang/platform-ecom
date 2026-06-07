# Database & Data Export for Windows Reset

This folder contains scripts to export all persistent data from the platform-ecom project before resetting Windows.

## What Needs to Be Backed Up

| Item                  | Location                                      | Why Important                                      | Script                     |
|-----------------------|-----------------------------------------------|----------------------------------------------------|----------------------------|
| PostgreSQL data       | 8 databases in Docker postgres                | All business data (users, products, orders, reviews, vouchers, analytics...) | `backup-all.ps1`          |
| **Images / Uploads**  | `../uploads/` (flat, ~96 files)               | **Seller product photos + review images** (referenced from DB). Critical for the site to look normal after reset. | `backup-uploads.ps1` (now zips by default) |
| Recommendation ML models | `../recommendation-service/ml/models/` + legacy path | Trained collaborative + content-based models (contain your real user behavior data) | `backup-ml-models.ps1`    |

**Note:** Sentiment model is loaded from Hugging Face at runtime — no local backup needed unless you fine-tuned it.

> **"the images also"** — Yes, the `uploads/` folder is **just as important** as the DB for a working storefront after restore. The DB only stores filenames; the actual binary image files live here.

## Databases (8 total)

| Database   | Service(s)          | Key Tables |
|------------|---------------------|------------|
| `users`    | user-service (auth) | `users`, `roles`, `user_role`, `addresses`, `otp_codes` |
| `products` | product-service     | `products`, `categories`, `product_variants`, `product_options`, `product_option_values`, `variant_option_values`, `product_images`, `description_images`, `sale_campaigns*`, + `embedding` (pgvector) |
| `inventory`| inventory-service   | `inventory`, `inventory_transactions`, `stock_reservations` |
| `orders`   | order-service       | `order_groups`, `sub_orders`, `sub_order_items`, `carts`, `cart_items`, `payment_transactions` |
| `promotion`| promotion-service   | `vouchers`, `voucher_scopes`, `voucher_usages`, `product_discount_history` |
| `reviews`  | review-service      | `reviews` (with jsonb images + sentiment) |
| `analytics`| analytics-service   | `user_profiles`, `user_events`, `product_analytics`, `daily_product_stats` |
| `chatbot`  | chatbot-service     | Whatever tables were created (conversations / embeddings cache if any) |

## Prerequisites (Before Running Scripts)

1. Docker Desktop running and the project containers up (at least `postgres`):
   ```powershell
   docker-compose up -d postgres
   ```
2. The `postgres` container must be healthy.
3. You are in the project root (`platform-ecom`).

## Quick Export (Recommended)

From **PowerShell in the project root**:

```powershell
# 1. Export all 8 Postgres databases (plain SQL)
cd backup
.\backup-all.ps1

# 2. Backup uploaded product images
.\backup-uploads.ps1

# 3. Backup trained recommendation models (important for personalization)
.\backup-ml-models.ps1
```

All outputs will be inside the `backup/` folder:
- `backup/*.sql` — one per database
- `backup/uploads/` — copy of all images (or a zip)
- `backup/ml-models/` — the two .pkl files

## After Windows Reset - Restore Steps

1. Reinstall Docker Desktop + Git.
2. Clone or copy your `platform-ecom` project back.
3. Start only Postgres (so DBs + extensions are initialized):
   ```powershell
   docker-compose up -d postgres
   # Wait 10-15 seconds for init script to create the 7 DBs + vector extension
   ```
4. (Optional but recommended) Also start pgadmin if you want to inspect:
   ```powershell
   docker-compose up -d pgadmin
   ```
5. Go into `backup/` folder and run the restore:
   ```powershell
   cd backup
   .\restore-all.ps1
   ```
6. **Restore the images** (very important!):
   ```powershell
   # If you have a zip (recommended)
   Expand-Archive -Path uploads-*.zip -DestinationPath ..\uploads -Force

   # Or if you have the loose folder
   Copy-Item -Path uploads\* -Destination ..\uploads -Recurse -Force
   ```
   This puts the product photos and review images back where the services expect them (`uploads/`, `uploads/products`, `uploads/reviews` etc. are served from the project root).

7. After restore, you can start the rest of the stack:
   ```powershell
   docker-compose up -d
   ```

## Manual Commands (if scripts fail or you prefer CLI)

### Dump a single database (plain SQL)

```powershell
# From project root
docker exec -e PGPASSWORD=204863 postgres pg_dump -U fragile --dbname=products --no-owner --no-acl --clean --if-exists -Fp > backup/products.sql
```

Repeat for: `users`, `inventory`, `orders`, `promotion`, `reviews`, `analytics`, `chatbot`.

### Create databases + required extensions manually (on fresh Postgres)

```powershell
# Connect to default 'postgres' database
docker exec -e PGPASSWORD=204863 -i postgres psql -U fragile -d postgres << 'EOF'
CREATE DATABASE users;
CREATE DATABASE inventory;
CREATE DATABASE orders;
CREATE DATABASE products;
CREATE DATABASE promotion;
CREATE DATABASE reviews;
CREATE DATABASE analytics;
CREATE DATABASE chatbot;
EOF

# Enable extensions on products (required for embeddings + trigram search)
docker exec -e PGPASSWORD=204863 -i postgres psql -U fragile -d products << 'EOF'
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
EOF
```

### Restore a single .sql dump

```powershell
# Example for products
Get-Content backup/products.sql | docker exec -e PGPASSWORD=204863 -i postgres psql -U fragile -d products
```

Do this for every database after the CREATE DATABASE + extensions steps.

## Important Notes

- The dumps use `--clean --if-exists` so they will drop existing tables before recreating. Good for re-runs on a fresh DB.
- Password is hardcoded in scripts as `204863` (matches your docker-compose + service configs). Change if you ever rotated it.
- Large tables (products with embeddings, analytics events, order history) may produce big .sql files. This is normal.
- **Images** live in the flat `uploads/` folder at the project root (not inside Docker). The DB only stores the filenames. Restoring the zip/folder back into `uploads/` is required for products and reviews to show pictures.
- Redis data (sessions, carts cache, etc.) is **not** backed up here — it is ephemeral. After restore, carts may appear empty until users log in again.
- Kafka / other infra have no durable business data.
- After restoring, you may want to retrain recommendation models if the .pkl files feel out of date (see `recommendation-service/ml/training/`).

## Files in This Folder

- `backup-all.ps1` — Exports all 8 DBs as plain .sql
- `restore-all.ps1` — Restores all 8 DBs + creates required extensions
- `backup-uploads.ps1` — Backs up `uploads/` (product + review images). **Creates a timestamped zip by default** for easy transport.
- `backup-ml-models.ps1` — Backs up the trained recommendation .pkl files
- `README.md` — This file

## Quick One-Command Backup (Recommended)

From the **project root** (PowerShell):

```powershell
.\backup-now.ps1
```

This runs DB export + images (zipped) + ML models in one go. Then copy the `backup/` folder somewhere safe.

## After Restore Verification Ideas

- Login with an existing user
- Browse products (images should load from uploads)
- Check that product embeddings still work (search / similar products)
- Place a test order or check order history
- Check admin panels for users, vouchers, campaigns, etc.

Good luck with the Windows reset!
