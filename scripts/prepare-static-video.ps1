$ErrorActionPreference = 'Stop'
$videoDirectory = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../public/videos'))
$videoSource = Join-Path $videoDirectory '官網首頁影片素材 - 阜居空間創意設計.mov'
$sourceHash = (Get-FileHash -LiteralPath $videoSource -Algorithm SHA256).Hash.ToLowerInvariant()
if ($sourceHash -ne '05a48f56bd9ac1899cb8201d4b7e51d4eac5a9982aa03f73785736a66cd05daf') {
    throw 'Original footage changed: choose a new versioned output name and update staticVideo.js before encoding.'
}
$mount = "type=bind,source=$videoDirectory,target=/media"
$base = 'rm-film-05a48f56bd9a-v1'
$stagingName = '.encode-' + [guid]::NewGuid().ToString('N')
$stagingDirectory = Join-Path $videoDirectory $stagingName
New-Item -ItemType Directory -Path $stagingDirectory | Out-Null
try {
    # Immutable names: publish completed files only, never overwrite. Bump v1 if settings change.
    if (!(Test-Path -LiteralPath (Join-Path $videoDirectory "$base.mp4"))) {
        & docker run --rm --mount $mount rm-design/media-tools:local -hide_banner -loglevel error -n -i '/media/官網首頁影片素材 - 阜居空間創意設計.mov' -an -map_metadata -1 -vf 'scale=1920:-2' -c:v libx264 -preset slow -crf 25 -pix_fmt yuv420p -movflags +faststart "/media/$stagingName/video.mp4"
        if ($LASTEXITCODE -ne 0) { throw 'Video encoding failed.' }
        Move-Item -LiteralPath (Join-Path $stagingDirectory 'video.mp4') -Destination (Join-Path $videoDirectory "$base.mp4")
    }
    if (!(Test-Path -LiteralPath (Join-Path $videoDirectory "$base-poster.webp"))) {
        & docker run --rm --mount $mount rm-design/media-tools:local -hide_banner -loglevel error -n -ss 1 -i '/media/官網首頁影片素材 - 阜居空間創意設計.mov' -frames:v 1 -vf 'scale=1600:-2' -c:v libwebp -quality 82 "/media/$stagingName/poster.webp"
        if ($LASTEXITCODE -ne 0) { throw 'Poster encoding failed.' }
        Move-Item -LiteralPath (Join-Path $stagingDirectory 'poster.webp') -Destination (Join-Path $videoDirectory "$base-poster.webp")
    }
} finally {
    # Only our two exact temporary outputs; never recursively delete a media directory.
    foreach ($temporaryName in @('video.mp4', 'poster.webp')) {
        $temporaryPath = Join-Path $stagingDirectory $temporaryName
        if (Test-Path -LiteralPath $temporaryPath) { Remove-Item -LiteralPath $temporaryPath }
    }
    Remove-Item -LiteralPath $stagingDirectory
}
Get-Item -LiteralPath (Join-Path $videoDirectory "$base.mp4"), (Join-Path $videoDirectory "$base-poster.webp") | Select-Object Name,Length
