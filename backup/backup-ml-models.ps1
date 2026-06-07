<#
.SYNOPSIS
    Backup the trained recommendation ML models (.pkl files).

.DESCRIPTION
    The collaborative filtering model (user behavior) and content-based model
    are trained from your real analytics events + product catalog.
    Losing them means the recommendation service falls back to cold-start
    (less personalized results) until you retrain.

    This script copies both possible locations the app uses.

.USAGE
    cd backup
    .\backup-ml-models.ps1
#>

[CmdletBinding()]
param(
    [string]$DestinationDir = "."
)

$ErrorActionPreference = "Stop"

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$destModels = Join-Path $DestinationDir "ml-models"
$sourceRoots = @(
    "..\recommendation-service\ml\models",
    "..\recommendation-service\app\ml\models"
)

Write-Host "=== Backing up Recommendation ML Models ===" -ForegroundColor Cyan

if (Test-Path $destModels) {
    Remove-Item $destModels -Recurse -Force
}
New-Item -ItemType Directory -Path $destModels -Force | Out-Null

$copied = 0

foreach ($root in $sourceRoots) {
    $resolved = Resolve-Path -Path $root -ErrorAction SilentlyContinue
    if (-not $resolved) {
        Write-Host "  Skipping (not found): $root" -ForegroundColor DarkGray
        continue
    }

    $pklFiles = Get-ChildItem -Path $resolved -Filter "*.pkl" -File -ErrorAction SilentlyContinue
    if ($pklFiles.Count -eq 0) {
        Write-Host "  No .pkl files in: $resolved" -ForegroundColor DarkGray
        continue
    }

    foreach ($f in $pklFiles) {
        $target = Join-Path $destModels $f.Name
        Copy-Item -Path $f.FullName -Destination $target -Force
        $sizeKb = [math]::Round($f.Length / 1KB, 1)
        Write-Host "  + $($f.Name) ($sizeKb KB)" -ForegroundColor Green
        $copied++
    }
}

if ($copied -eq 0) {
    Write-Host ""
    Write-Warning "No recommendation model files were found. This is OK if you never trained them."
    Write-Host "The models live in recommendation-service/ml/models/ after training."
} else {
    Write-Host ""
    Write-Host "Backed up $copied model file(s) to: $destModels" -ForegroundColor Green
    Write-Host ""
    Write-Host "After restore:" -ForegroundColor Yellow
    Write-Host "  - Copy the .pkl files back to recommendation-service/ml/models/"
    Write-Host "  - (Optional) retrain using the scripts in recommendation-service/ml/training/"
}

Write-Host ""
Write-Host "Note: The sentiment model is a public HuggingFace model (wonrax/phobert-base-vietnamese-sentiment)."
Write-Host "      It will be downloaded automatically - nothing to back up." -ForegroundColor DarkGray
