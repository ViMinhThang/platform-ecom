<#
.SYNOPSIS
    One-command backup of all important data (DBs + uploads + ML models) before Windows reset.

.DESCRIPTION
    Runs the three backup scripts located in ./backup in the correct order.
    Run this from the project root (platform-ecom folder).

.EXAMPLE
    .\backup-now.ps1
#>

[CmdletBinding()]
param(
    [switch]$SkipUploads,
    [switch]$SkipModels,
    # Include the small root-level images/ folder too (usually not critical)
    [switch]$IncludeRootImages
)

$ErrorActionPreference = "Stop"

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host " platform-ecom FULL BACKUP (for Windows reset)   " -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

$backupDir = Join-Path $PSScriptRoot "backup"
if (-not (Test-Path $backupDir)) {
    Write-Error "backup/ folder not found next to this script. Did you delete it?"
    exit 1
}

Push-Location $backupDir

try {
    # 1. Databases (always do this)
    Write-Host "[1/3] Exporting all PostgreSQL databases..." -ForegroundColor Yellow
    & .\backup-all.ps1
    if ($LASTEXITCODE -ne 0) { Write-Warning "Database backup had issues." }

    # 2. Images / uploads (product photos, review images, etc.)
    if (-not $SkipUploads) {
        Write-Host ""
        Write-Host "[2/3] Backing up images (uploads/ + product/review assets)..." -ForegroundColor Yellow
        $imgArgs = @{}
        if ($IncludeRootImages) { $imgArgs['IncludeRootImages'] = $true }
        & .\backup-uploads.ps1 @imgArgs
    } else {
        Write-Host ""
        Write-Host "[2/3] Skipping images/uploads ( -SkipUploads )" -ForegroundColor DarkGray
    }

    # 3. ML models
    if (-not $SkipModels) {
        Write-Host ""
        Write-Host "[3/3] Backing up recommendation ML models..." -ForegroundColor Yellow
        & .\backup-ml-models.ps1
    } else {
        Write-Host ""
        Write-Host "[3/3] Skipping ML models ( -SkipModels )" -ForegroundColor DarkGray
    }
}
finally {
    Pop-Location
}

Write-Host ""
Write-Host "==================================================" -ForegroundColor Green
Write-Host " BACKUP COMPLETE" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green
Write-Host ""
Write-Host "What to do now:" -ForegroundColor Yellow
Write-Host "  - Copy the entire 'backup' folder (especially the uploads-*.zip and *.sql files) to external drive / cloud."
Write-Host "  - Also keep a copy of the full platform-ecom source folder."
Write-Host "  - After reset, see backup\README.md for restore steps (images go back into the project root 'uploads/' folder)."
Write-Host ""
Write-Host "Images are now zipped by default for easy copying before your Windows reset." -ForegroundColor DarkGray
