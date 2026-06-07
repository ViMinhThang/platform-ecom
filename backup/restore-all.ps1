<#
.SYNOPSIS
    Restore all platform-ecom PostgreSQL databases from the .sql dumps produced by backup-all.ps1.

.DESCRIPTION
    1. Assumes you have already started a fresh postgres container (docker-compose up -d postgres).
    2. Creates the 8 databases if they do not exist.
    3. Enables required extensions on the 'products' database (vector + pg_trgm).
    4. Pipes each <db>.sql into psql connected to that database.

    This script uses docker exec + stdin piping. No native PostgreSQL client needed on Windows.

.USAGE (after Windows reset)
    cd backup
    .\restore-all.ps1

.PREREQUISITES
    - Docker running
    - `docker-compose up -d postgres` completed (init script creates most DBs + vector extension)
    - The .sql files from backup-all.ps1 are in the same folder as this script
#>

[CmdletBinding()]
param(
    [string]$ContainerName = "postgres",
    [string]$DbUser = "fragile",
    [string]$DbPassword = "204863",
    [string]$OutputDir = ".",
    [string[]]$Databases = @(
        "users",
        "products",
        "inventory",
        "orders",
        "promotion",
        "reviews",
        "analytics",
        "chatbot"
    )
)

$ErrorActionPreference = "Stop"

function Invoke-DockerPsql {
    param(
        [Parameter(Mandatory)]
        [string]$Database,
        [Parameter(Mandatory)]
        [string]$Command
    )
    docker exec -e "PGPASSWORD=$DbPassword" -i $ContainerName `
        psql -U $DbUser -d $Database -c $Command
}

Write-Host "=== platform-ecom PostgreSQL Restore ===" -ForegroundColor Cyan
Write-Host "Container : $ContainerName"
Write-Host "User      : $DbUser"
Write-Host ""

# 1. Ensure all databases exist (connect to the default 'postgres' database)
Write-Host "Ensuring databases exist..." -ForegroundColor Yellow
foreach ($db in $Databases) {
    $exists = docker exec -e "PGPASSWORD=$DbPassword" $ContainerName `
        psql -U $DbUser -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='$db';"

    if ($exists -eq "1") {
        Write-Host "  - $db : already exists" -ForegroundColor DarkGray
    } else {
        Write-Host "  - Creating $db ..." -NoNewline
        docker exec -e "PGPASSWORD=$DbPassword" $ContainerName `
            psql -U $DbUser -d postgres -c "CREATE DATABASE $db;" | Out-Null
        Write-Host " created" -ForegroundColor Green
    }
}

# 2. Enable extensions required by products database (vector embeddings + trigram indexes)
Write-Host ""
Write-Host "Enabling extensions on 'products' (vector + pg_trgm)..." -ForegroundColor Yellow
try {
    docker exec -e "PGPASSWORD=$DbPassword" -i $ContainerName `
        psql -U $DbUser -d products -c "CREATE EXTENSION IF NOT EXISTS vector;" | Out-Null
    docker exec -e "PGPASSWORD=$DbPassword" -i $ContainerName `
        psql -U $DbUser -d products -c "CREATE EXTENSION IF NOT EXISTS pg_trgm;" | Out-Null
    Write-Host "  Extensions OK" -ForegroundColor Green
} catch {
    Write-Warning "Could not create extensions on products. Some features (embeddings/search) may not work until you run the extensions manually."
}

# 3. Restore each database
Write-Host ""
Write-Host "Restoring data from SQL dumps..." -ForegroundColor Yellow
$success = @()
$failed = @()

foreach ($db in $Databases) {
    $sqlFile = Join-Path $OutputDir "$db.sql"

    if (-not (Test-Path $sqlFile)) {
        Write-Host "  - $db : SKIP (file not found: $sqlFile)" -ForegroundColor DarkYellow
        continue
    }

    $sizeKb = [math]::Round((Get-Item $sqlFile).Length / 1KB, 1)
    Write-Host "  - Restoring $db from $sqlFile ($sizeKb KB) ..." -NoNewline

    try {
        # Pipe the SQL file into psql connected to the target database
        Get-Content -Path $sqlFile -Raw -Encoding UTF8 |
            docker exec -e "PGPASSWORD=$DbPassword" -i $ContainerName `
                psql -U $DbUser -d $db --quiet 2>&1 | Out-Null

        if ($LASTEXITCODE -eq 0) {
            Write-Host " OK" -ForegroundColor Green
            $success += $db
        } else {
            throw "psql exited with code $LASTEXITCODE"
        }
    }
    catch {
        Write-Host " FAILED" -ForegroundColor Red
        Write-Warning "Error restoring ${db}: $_"
        $failed += $db
    }
}

Write-Host ""
Write-Host "=== Restore Summary ===" -ForegroundColor Cyan
Write-Host "Successful : $($success -join ', ')" -ForegroundColor Green
if ($failed.Count -gt 0) {
    Write-Host "Failed     : $($failed -join ', ')" -ForegroundColor Red
    Write-Host ""
    Write-Host "You can retry a single DB manually:" -ForegroundColor Yellow
    Write-Host "  Get-Content backup\products.sql | docker exec -e PGPASSWORD=204863 -i postgres psql -U fragile -d products"
}

Write-Host ""
Write-Host "Next steps after restore:" -ForegroundColor Yellow
Write-Host "  - Start the full stack:  docker-compose up -d"
Write-Host "  - Verify a few things:"
Write-Host "      * Login with an existing account"
Write-Host "      * Browse products (check images load from /uploads)"
Write-Host "      * Test product search / embeddings if you use them"
Write-Host "      * Look at recent orders or reviews"
Write-Host ""
Write-Host "Recommendation models (if backed up) are file-based and will be picked up automatically." -ForegroundColor DarkGray
