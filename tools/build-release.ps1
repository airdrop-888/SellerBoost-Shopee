param(
    [Parameter(Mandatory = $false)]
    [string]$Watermark = "",
    [string]$Owner = "",
    [string]$Contact = "",
    [switch]$SkipBuild
)

# Build installer SellerBoost dengan identitas/watermark pembeli.
# Contoh:
#   .\tools\build-release.ps1 -Watermark "INV-2026-0117" -Owner "Budi" -Contact "wa.me/628xxx"

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

if (-not (Test-Path "node_modules")) {
    npm install
    if ($LASTEXITCODE -ne 0) { throw "npm install gagal" }
}

$brandPath = Join-Path $root "src\branding.json"
$brand = @{
    product   = "SellerBoost"
    owner     = $Owner
    contact   = $Contact
    watermark = $Watermark
}
$brand | ConvertTo-Json | Set-Content -Path $brandPath -Encoding UTF8
Write-Host "branding.json ditulis: watermark='$Watermark' owner='$Owner'"

if ($SkipBuild) {
    Write-Host "SkipBuild aktif - branding saja."
    return
}

npm run dist:nsis
if ($LASTEXITCODE -ne 0) { throw "build installer gagal" }

New-Item -ItemType Directory -Force -Path "release" | Out-Null
Get-ChildItem "dist-build" -Include *.exe,*.blockmap,latest.yml -File | Move-Item -Destination "release" -Force

Write-Host ""
Write-Host "Selesai. Hasil di folder release\:"
Get-ChildItem "release" -File | Select-Object Name, @{n = "MB"; e = { "{0:N1}" -f ($_.Length / 1MB) } } | Format-Table -AutoSize
