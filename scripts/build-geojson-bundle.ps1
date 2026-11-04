$ErrorActionPreference = "Stop"

$root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$appPath = Join-Path $root "js\app.js"
$outputPath = Join-Path $root "js\geojson-data.js"
$appSource = [System.IO.File]::ReadAllText($appPath)
$layerMatches = [regex]::Matches($appSource, 'file:"([^"]+\.geojson)"')

if ($layerMatches.Count -eq 0) {
    throw "No GeoJSON layer paths were found in js\app.js"
}

$layerFiles = @($layerMatches | ForEach-Object { $_.Groups[1].Value })
if (($layerFiles | Select-Object -Unique).Count -ne $layerFiles.Count) {
    throw "Duplicate GeoJSON layer paths were found in js\app.js"
}

$bundle = New-Object System.Text.StringBuilder
[void]$bundle.Append("window.SIRIONI_GEOJSON={")

for ($index = 0; $index -lt $layerFiles.Count; $index++) {
    $layerFile = $layerFiles[$index]
    $relativePath = $layerFile.Substring(2).Replace("/", "\")
    $sourcePath = Join-Path $root $relativePath
    if (-not (Test-Path -LiteralPath $sourcePath -PathType Leaf)) {
        throw "GeoJSON source not found: $sourcePath"
    }

    $json = [System.IO.File]::ReadAllText($sourcePath)
    if ($index -gt 0) {
        [void]$bundle.Append(",")
    }
    [void]$bundle.Append((ConvertTo-Json -InputObject $layerFile -Compress))
    [void]$bundle.Append(":")
    [void]$bundle.Append($json)
}

[void]$bundle.Append("};")
$temporaryPath = "$outputPath.tmp"
$encoding = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($temporaryPath, $bundle.ToString(), $encoding)

if (Test-Path -LiteralPath $outputPath) {
    [System.IO.File]::Replace($temporaryPath, $outputPath, $null)
} else {
    [System.IO.File]::Move($temporaryPath, $outputPath)
}

Write-Output "Built js\geojson-data.js with $($layerFiles.Count) GeoJSON files."
