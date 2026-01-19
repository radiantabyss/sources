param (
    [string]$zip_path,
    [string]$destination
)

Add-Type -AssemblyName System.IO.Compression.FileSystem

$zip = [System.IO.Compression.ZipFile]::OpenRead($zip_path)
$total_entries = $zip.Entries.Count
$current_index = 0

foreach ($entry in $zip.Entries) {
    $current_index++
    $percent = [math]::Floor(($current_index / $total_entries) * 100)
    Write-Output "PROGRESS: $percent%"

    $output_path = Join-Path $destination $entry.FullName
    $entry_dir = Split-Path $output_path

    if (-not (Test-Path $entry_dir)) {
        New-Item -ItemType Directory -Path $entry_dir | Out-Null
    }
    else {
        # dir exists - nothing to do
    }

    if (-not $entry.FullName.EndsWith('/')) {
        [System.IO.Compression.ZipFileExtensions]::ExtractToFile($entry, $output_path, $true)
    }
    else {
        # directory entry - skip
    }
}

$zip.Dispose()
Write-Output "DONE"
