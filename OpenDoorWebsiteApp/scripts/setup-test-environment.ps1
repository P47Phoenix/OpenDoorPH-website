# Multi-Environment Testing Setup Script for OpenDoor Website
# This script sets up test environments for different root URI configurations

Write-Host "Setting up Multi-Environment Testing for OpenDoor Website" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green

# Clean up previous test builds
Write-Host "Cleaning up previous test builds..." -ForegroundColor Yellow
if (Test-Path "test-builds") {
    Remove-Item -Recurse -Force "test-builds"
}
New-Item -ItemType Directory -Path "test-builds" -Force | Out-Null

# Build for Root Domain (/)
Write-Host "Building for Root Domain (/)..." -ForegroundColor Cyan
npm run build:prod
if ($LASTEXITCODE -eq 0) {
    New-Item -ItemType Directory -Path "test-builds\root-domain" -Force | Out-Null
    Copy-Item -Recurse "build\*" "test-builds\root-domain"
    Write-Host "✅ Root domain build completed" -ForegroundColor Green
} else {
    Write-Host "❌ Root domain build failed" -ForegroundColor Red
    exit 1
}

# Build for GitHub Pages (/OpenDoorPH-website/)
Write-Host "Building for GitHub Pages (/OpenDoorPH-website/)..." -ForegroundColor Cyan
npm run build:gh-pages
if ($LASTEXITCODE -eq 0) {
    New-Item -ItemType Directory -Path "test-builds\github-pages" -Force | Out-Null
    Copy-Item -Recurse "build\*" "test-builds\github-pages"
    Write-Host "✅ GitHub Pages build completed" -ForegroundColor Green
} else {
    Write-Host "❌ GitHub Pages build failed" -ForegroundColor Red
    exit 1
}

# Build for Custom Path (/CustomPath/)
Write-Host "Building for Custom Path (/CustomPath/)..." -ForegroundColor Cyan
npm run build:custom
if ($LASTEXITCODE -eq 0) {
    New-Item -ItemType Directory -Path "test-builds\custom-path" -Force | Out-Null
    Copy-Item -Recurse "build\*" "test-builds\custom-path"
    Write-Host "✅ Custom path build completed" -ForegroundColor Green
} else {
    Write-Host "❌ Custom path build failed" -ForegroundColor Red
    exit 1
}

# Build for Deep Nested Path (/level1/level2/app/)
Write-Host "Building for Deep Nested Path (/level1/level2/app/)..." -ForegroundColor Cyan
npm run build:deep
if ($LASTEXITCODE -eq 0) {
    New-Item -ItemType Directory -Path "test-builds\deep-nested" -Force | Out-Null
    Copy-Item -Recurse "build\*" "test-builds\deep-nested"
    Write-Host "✅ Deep nested build completed" -ForegroundColor Green
} else {
    Write-Host "❌ Deep nested build failed" -ForegroundColor Red
    exit 1
}

Write-Host "`nTest Environment Setup Complete!" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green
Write-Host "Available test builds:" -ForegroundColor White
Write-Host "  - test-builds\root-domain (for / deployment)" -ForegroundColor Gray
Write-Host "  - test-builds\github-pages (for /OpenDoorPH-website/ deployment)" -ForegroundColor Gray
Write-Host "  - test-builds\custom-path (for /CustomPath/ deployment)" -ForegroundColor Gray
Write-Host "  - test-builds\deep-nested (for /level1/level2/app/ deployment)" -ForegroundColor Gray

Write-Host "`nNext Steps:" -ForegroundColor Yellow
Write-Host "1. Run 'npm run test:root' to test root domain configuration" -ForegroundColor White
Write-Host "2. Run 'npm run test:github' to test GitHub Pages configuration" -ForegroundColor White
Write-Host "3. Run 'npm run test:custom' to test custom path configuration" -ForegroundColor White
Write-Host "4. Run 'npm run test:deep' to test deep nested configuration" -ForegroundColor White
Write-Host "`nEach command will serve the build on a different port:" -ForegroundColor Yellow
Write-Host "  - Root domain: http://localhost:3000/" -ForegroundColor White
Write-Host "  - GitHub Pages: http://localhost:3001/OpenDoorPH-website/" -ForegroundColor White
Write-Host "  - Custom path: http://localhost:3002/CustomPath/" -ForegroundColor White
Write-Host "  - Deep nested: http://localhost:3003/level1/level2/app/" -ForegroundColor White
