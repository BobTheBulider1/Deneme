Add-Type -AssemblyName System.Drawing
$imagePath = "C:\Users\İbrahim MATARMAVI\Desktop\restorantlar\Namık Baydar\assests\Logo Namık Baydar.PNG"
$img = [System.Drawing.Image]::FromFile($imagePath)
$bmp = new-object System.Drawing.Bitmap($img)
$img.Dispose()

# We can iterate over pixels to remove white AND near-white pixels for better anti-aliasing handling
for ($y = 0; $y -lt $bmp.Height; $y++) {
    for ($x = 0; $x -lt $bmp.Width; $x++) {
        $pixel = $bmp.GetPixel($x, $y)
        # If the pixel is close to white (R,G,B > 240)
        if ($pixel.R -gt 240 -and $pixel.G -gt 240 -and $pixel.B -gt 240) {
            $transparentColor = [System.Drawing.Color]::FromArgb(0, 255, 255, 255)
            $bmp.SetPixel($x, $y, $transparentColor)
        }
    }
}

$bmp.Save($imagePath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
Write-Host "Arka plan başarıyla şeffaf yapıldı."
