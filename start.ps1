$dir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $dir

Write-Host ""
Write-Host "  BRIUNKA LIGHT — Link in Bio" -ForegroundColor Yellow
Write-Host "  http://localhost:8847" -ForegroundColor Cyan
Write-Host ""

Get-NetTCPConnection -LocalPort 8847 -ErrorAction SilentlyContinue |
    ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }

pip install -q -r requirements.txt 2>$null

if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "  Created .env — add your Stripe/PayPal keys" -ForegroundColor DarkYellow
}

Start-Process "http://localhost:8847"
python server.py