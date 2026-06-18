# Briunka Light — Deploy to Render.com
# Run this after pushing to GitHub

$ErrorActionPreference = "Stop"
$ProjectDir = $PSScriptRoot
Set-Location $ProjectDir

Write-Host ""
Write-Host "  BRIUNKA LIGHT — GO LIVE" -ForegroundColor Yellow
Write-Host "  =======================" -ForegroundColor DarkGray
Write-Host ""

# Step 1: GitHub
Write-Host "STEP 1: Push to GitHub" -ForegroundColor Cyan
$remote = git remote get-url origin 2>$null
if (-not $remote) {
    Write-Host "  No GitHub remote yet." -ForegroundColor DarkYellow
    $repo = Read-Host "  Enter your GitHub repo (e.g. yourname/briunka-light-link)"
    if ($repo) {
        git remote add origin "https://github.com/$repo.git"
        Write-Host "  Remote added: https://github.com/$repo.git" -ForegroundColor Green
    }
}

Write-Host "  Run: gh auth login" -ForegroundColor DarkGray
Write-Host "  Then: git push -u origin master" -ForegroundColor DarkGray
Write-Host ""

# Step 2: Render
Write-Host "STEP 2: Deploy on Render.com" -ForegroundColor Cyan
Write-Host "  1. Go to https://dashboard.render.com/select-repo?type=blueprint" -ForegroundColor White
Write-Host "  2. Connect your GitHub account" -ForegroundColor White
Write-Host "  3. Select the briunka-light-link repo" -ForegroundColor White
Write-Host "  4. Render reads render.yaml automatically" -ForegroundColor White
Write-Host "  5. Set these env vars in Render dashboard:" -ForegroundColor White
Write-Host "     SITE_URL = https://your-app.onrender.com" -ForegroundColor DarkGray
Write-Host "     STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY" -ForegroundColor DarkGray
Write-Host "     PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET" -ForegroundColor DarkGray
Write-Host "     LIVE_ADMIN_PIN (change from default!)" -ForegroundColor DarkGray
Write-Host "     SMTP_USER, SMTP_PASS (Gmail app password)" -ForegroundColor DarkGray
Write-Host "     TWILIO_* (optional SMS)" -ForegroundColor DarkGray
Write-Host ""

# Step 3: Payments
Write-Host "STEP 3: Payment keys" -ForegroundColor Cyan
Write-Host "  Stripe: https://dashboard.stripe.com/apikeys" -ForegroundColor DarkGray
Write-Host "  PayPal: https://developer.paypal.com/dashboard/ (use LIVE mode)" -ForegroundColor DarkGray
Write-Host "  Or run: .\setup-payments.ps1" -ForegroundColor DarkGray
Write-Host ""

# Step 4: Custom domain (optional)
Write-Host "STEP 4: Custom domain (optional)" -ForegroundColor Cyan
Write-Host "  In Render: Settings > Custom Domains" -ForegroundColor DarkGray
Write-Host "  Point your domain DNS to Render" -ForegroundColor DarkGray
Write-Host "  Update SITE_URL to your custom domain" -ForegroundColor DarkGray
Write-Host ""

Write-Host "  Your Skool link is featured first on the page:" -ForegroundColor Green
Write-Host "  https://www.skool.com/light-works-universe-5888" -ForegroundColor Yellow
Write-Host ""

$open = Read-Host "Open Render deploy page now? (y/n)"
if ($open -eq 'y') {
    Start-Process "https://dashboard.render.com/select-repo?type=blueprint"
}