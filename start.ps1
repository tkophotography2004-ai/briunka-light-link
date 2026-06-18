$dir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $dir

Write-Host ""
Write-Host "  BRIUNKA LIGHT — Link in Bio" -ForegroundColor Yellow
Write-Host "  http://localhost:8847" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Installing dependencies..." -ForegroundColor DarkGray

pip install -q -r requirements.txt 2>$null

if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "  Created .env — add your Stripe/PayPal keys" -ForegroundColor DarkYellow
}

python server.py