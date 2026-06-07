<#
.SYNOPSIS
    Export all 8 PostgreSQL databases from the platform-ecom project to plain SQL scripts.

.DESCRIPTION
    Uses docker exec to run pg_dump inside the 'postgres' container.
    Produces one .sql file per database in the current directory (or .\backup\).
    Safe for Windows. No native psql/pg_dump installation required on the host.

.USAGE
    From the 'backup' folder or project root:
        .\backup\backup-all.ps1
        # or
        cd backup; .\backup-all.ps1

.OUTPUT
    users.sql, products.sql, inventory.sql, orders.sql,
    promotion.sql, reviews.sql, analytics.sql, chatbot.sql
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

Write-Host "=== platform-ecom PostgreSQL Export ===" -ForegroundColor Cyan
Write-Host "Container : $ContainerName"
Write-Host "User      : $DbUser"
Write-Host "Databases : $($Databases -join ', ')"
Write-Host "Output    : $OutputDir"
Write-Host ""

# Ensure output directory exists
if (-not (Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir | Out-Null
}

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$success = @()
$failed = @()

foreach ($db in $Databases) {
    $outputFile = Join-Path $OutputDir "$db.sql"
    Write-Host "Dumping '$db' -> $outputFile ..." -NoNewline

    try {
        # Run pg_dump inside the container with password via env var
        # --no-owner + --no-acl = portable (no role/permission issues on restore)
        # --clean + --if-exists = safe to re-run against existing schema
        # -Fp = plain SQL format (what you asked for)
        $dumpCmd = "pg_dump -U $DbUser --dbname=$db --no-owner --no-acl --clean --if-exists -Fp"

        docker exec -e "PGPASSWORD=$DbPassword" $ContainerName `
            sh -c "$dumpCmd" | Out-File -FilePath $outputFile -Encoding utf8 -Force

        if ($LASTEXITCODE -eq 0 -and (Test-Path $outputFile) -and (Get-Item $outputFile).Length -gt 0) {
            $sizeKb = [math]::Round((Get-Item $outputFile).Length / 1KB, 1)
            Write-Host " OK ($sizeKb KB)" -ForegroundColor Green
            $success += $db
        } else {
            throw "pg_dump produced empty or no output (exit code $LASTEXITCODE)"
        }
    }
    catch {
        Write-Host " FAILED" -ForegroundColor Red
        Write-Warning "Error dumping ${db}: $_"
        $failed += $db
        # Remove partial file
        if (Test-Path $outputFile) { Remove-Item $outputFile -Force -ErrorAction SilentlyContinue }
    }
}

Write-Host ""
Write-Host "=== Export Summary ===" -ForegroundColor Cyan
Write-Host "Successful : $($success -join ', ')" -ForegroundColor Green
if ($failed.Count -gt 0) {
    Write-Host "Failed     : $($failed -join ', ')" -ForegroundColor Red
}

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Also run: .\backup-uploads.ps1"
Write-Host "  2. Also run: .\backup-ml-models.ps1   (if you trained recommendation models)"
Write-Host "  3. Copy the entire 'backup' folder to a safe location (external drive / cloud)"
Write-Host ""
Write-Host "After Windows reset, see README.md for restore instructions." -ForegroundColor Yellow
