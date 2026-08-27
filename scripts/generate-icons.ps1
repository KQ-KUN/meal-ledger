param(
  [int[]]$Sizes = @(192, 512)
)

Add-Type -AssemblyName System.Drawing

$iconDirectory = Join-Path $PSScriptRoot "..\public\icons"

foreach ($size in $Sizes) {
  $bitmap = New-Object System.Drawing.Bitmap($size, $size)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.Clear([System.Drawing.Color]::FromArgb(29, 41, 35))

  $accentBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 123, 82))
  $accentGlowBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(42, 255, 123, 82))
  $lightPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 248, 238), [single]($size * 0.05))
  $lightPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $lightPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round

  $graphics.FillEllipse($accentGlowBrush, $size * 0.62, -$size * 0.04, $size * 0.42, $size * 0.42)

  $bowl = New-Object System.Drawing.Drawing2D.GraphicsPath
  $bowl.StartFigure()
  $bowl.AddLine($size * 0.24, $size * 0.47, $size * 0.76, $size * 0.47)
  $bowl.AddBezier(
    $size * 0.76, $size * 0.47,
    $size * 0.72, $size * 0.72,
    $size * 0.58, $size * 0.76,
    $size * 0.50, $size * 0.76
  )
  $bowl.AddBezier(
    $size * 0.50, $size * 0.76,
    $size * 0.42, $size * 0.76,
    $size * 0.28, $size * 0.72,
    $size * 0.24, $size * 0.47
  )
  $bowl.CloseFigure()
  $graphics.FillPath($accentBrush, $bowl)

  $graphics.DrawLine($lightPen, $size * 0.21, $size * 0.47, $size * 0.79, $size * 0.47)
  $graphics.DrawBezier(
    $lightPen,
    $size * 0.40, $size * 0.37,
    $size * 0.34, $size * 0.29,
    $size * 0.47, $size * 0.25,
    $size * 0.40, $size * 0.17
  )
  $graphics.DrawBezier(
    $lightPen,
    $size * 0.60, $size * 0.37,
    $size * 0.54, $size * 0.29,
    $size * 0.67, $size * 0.25,
    $size * 0.60, $size * 0.17
  )
  $graphics.DrawLine($lightPen, $size * 0.42, $size * 0.76, $size * 0.39, $size * 0.83)
  $graphics.DrawLine($lightPen, $size * 0.58, $size * 0.76, $size * 0.61, $size * 0.83)

  $outputPath = Join-Path $iconDirectory "icon-$size.png"
  $bitmap.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)

  $bowl.Dispose()
  $lightPen.Dispose()
  $accentGlowBrush.Dispose()
  $accentBrush.Dispose()
  $graphics.Dispose()
  $bitmap.Dispose()
}
