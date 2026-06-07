<#
.SYNOPSIS
    Backup all uploaded product images and assets from ../uploads into this backup folder.

.DESCRIPTION
    Simply copies the uploads directory (or creates a timestamped zip for easier transport).
    These files are referenced by product_images and description_images tables.

.USAGE
    From the backup folder:
        .\backup-uploads.ps1

    Or with zip:
        .\backup-uploads.ps1 -Zip
#>

[CmdletBinding()]
param(
    # By default we ALWAYS create a zip for easy transport before Windows reset.
    # Use -NoZip if you really want a loose folder copy instead.
    [switch]$NoZip,
    [string]$SourcePath = "..\uploads",
    [string]$DestinationDir = ".",
    # Also back up the small root-level images/ folder (test assets, etc.)
    [switch]$IncludeRootImages
)

$ErrorActionPreference = "Stop"

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"

Write-Host "=== Backing up images (uploads + review/product assets) ===" -ForegroundColor Cyan

# --- Main uploads folder (product images, review images, etc.) ---
$uploadsSource = Resolve-Path -Path $SourcePath -ErrorAction SilentlyContinue
if (-not $uploadsSource) {
    Write-Warning "Main uploads folder not found at '$SourcePath' (skipping uploads)."
} else {
    $destUploads = Join-Path $DestinationDir "uploads"
    Write-Host "Source (uploads) : $uploadsSource"

    if (Test-Path $destUploads) {
        Remove-Item $destUploads -Recurse -Force
    }
    New-Item -ItemType Directory -Path $destUploads -Force | Out-Null

    Copy-Item -Path "$uploadsSource\*" -Destination $destUploads -Recurse -Force -ErrorAction SilentlyContinue

    $fileCount = (Get-ChildItem -Path $destUploads -Recurse -File).Count
    $totalSizeMb = [math]::Round( (Get-ChildItem -Path $destUploads -Recurse -File | Measure-Object -Property Length -Sum).Sum / 1MB , 2)

    Write-Host "  Copied $fileCount files ($totalSizeMb MB) from uploads/" -ForegroundColor Green

    if (-not $NoZip) {
        $zipPath = Join-Path $DestinationDir "uploads-$timestamp.zip"
        Write-Host "  Creating zip: $zipPath ..." -NoNewline
        Compress-Archive -Path "$destUploads\*" -DestinationPath $zipPath -Force
        $zipSizeMb = [math]::Round( (Get-Item $zipPath).Length / 1MB , 2)
        Write-Host " OK ($zipSizeMb MB)" -ForegroundColor Green

        # Clean up the loose copy to keep backup folder small (you have the zip)
        Remove-Item $destUploads -Recurse -Force -ErrorAction SilentlyContinue
    } else {
        Write-Host "  Loose folder kept at: $destUploads (because -NoZip)" -ForegroundColor DarkGray
    }
}

# --- Optional: also grab the small root images/ folder ---
if ($IncludeRootImages) {
    $rootImagesSource = Resolve-Path -Path "..\images" -ErrorAction SilentlyContinue
    if ($rootImagesSource) {
        $destRootImages = Join-Path $DestinationDir "images-root"
        if (Test-Path $destRootImages) { Remove-Item $destRootImages -Recurse -Force }
        New-Item -ItemType Directory -Path $destRootImages -Force | Out-Null
        Copy-Item -Path "$rootImagesSource\*" -Destination $destRootImages -Recurse -Force

        $rc = (Get-ChildItem $destRootImages -File).Count
        Write-Host "  Also copied $rc file(s) from root images/ folder" -ForegroundColor Green

        if (-not $NoZip) {
            $rootZip = Join-Path $DestinationDir "images-root-$timestamp.zip"
            Compress-Archive -Path "$destRootImages\*" -DestinationPath $rootZip -Force
            Remove-Item $destRootImages -Recurse -Force
        }
    }
}

Write-Host ""
Write-Host "Image backup complete." -ForegroundColor Green
if (-not $NoZip) {
    Write-Host "Zipped archives are in this folder (easy to copy before reset)." -ForegroundColor DarkGray
}
