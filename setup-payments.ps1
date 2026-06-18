$dir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $dir

Write-Host ""
Write-Host "  BRIUNKA LIGHT — Payment Setup" -ForegroundColor Yellow
Write-Host ""

if (-not (Test-Path ".env")) { Copy-Item ".env.example" ".env" }

function Prompt-Key($label, $default = "") {
    $val = Read-Host "  $label"
    if (-not $val -and $default) { return $default }
    return $val
}

Write-Host "  Get Stripe keys: https://dashboard.stripe.com/apikeys" -ForegroundColor DarkGray
$stripePub = Prompt-Key "Stripe Publishable Key (pk_test_...)"
$stripeSec = Prompt-Key "Stripe Secret Key (sk_test_...)"
$stripeHook = Prompt-Key "Stripe Webhook Secret (whsec_...) [optional]"

Write-Host ""
Write-Host "  Get PayPal keys: https://developer.paypal.com/dashboard/" -ForegroundColor DarkGray
$paypalId = Prompt-Key "PayPal Client ID"
$paypalSec = Prompt-Key "PayPal Client Secret"
$paypalMode = Prompt-Key "PayPal Mode (sandbox or live)" "sandbox"

$siteUrl = Prompt-Key "Site URL" "http://localhost:8847"

$envContent = @"
SITE_URL=$siteUrl
STRIPE_PUBLISHABLE_KEY=$stripePub
STRIPE_SECRET_KEY=$stripeSec
STRIPE_WEBHOOK_SECRET=$stripeHook
PAYPAL_CLIENT_ID=$paypalId
PAYPAL_CLIENT_SECRET=$paypalSec
PAYPAL_MODE=$paypalMode
PORT=8847
"@

$envContent | Set-Content ".env" -Encoding UTF8

Write-Host ""
Write-Host "  Keys saved to .env" -ForegroundColor Green
Write-Host "  Run START BIO PAGE.bat to launch with payments enabled." -ForegroundColor Cyan
Write-Host ""