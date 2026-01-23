$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$pkgPath = Join-Path $root 'package.json'
$pkg = Get-Content $pkgPath | ConvertFrom-Json

$outDir = Join-Path $root 'releases'
$nodeVersion = $null
try {
  $nodeVersion = (& node --version).Trim()
} catch {
  $nodeVersion = $null
}

if (-not $nodeVersion) {
  throw 'Node.js 20+ is required. Install Node.js 20 or newer and try again.'
}

$major = [int]($nodeVersion -replace '^[vV]', '' -replace '\..*$', '')
if ($major -lt 20) {
  throw "Node.js 20+ is required. Current: $nodeVersion"
}

New-Item -ItemType Directory -Force -Path $outDir | Out-Null
$vsixName = 'txtilt-{0}.vsix' -f $pkg.version
$vsixPath = Join-Path $outDir $vsixName

& npx --yes @vscode/vsce package --skip-license -o $vsixPath
Write-Host "Created $vsixPath"
