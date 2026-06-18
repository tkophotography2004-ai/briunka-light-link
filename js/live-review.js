const REVIEW_TIERS = {
    standard: { id: 'standard', price: 5, label: 'Standard', desc: 'Join the review queue in order', icon: 'fa-clock', badge: '' },
    skip: { id: 'skip', price: 10, label: 'Skip the Line', desc: 'Jump ahead of standard submissions', icon: 'fa-forward', badge: 'POPULAR' },
    super_skip: { id: 'super_skip', price: 15, label: 'Super Skip', desc: 'Priority placement — reviewed first', icon: 'fa-bolt', badge: 'VIP' }
};

let selectedReviewTier = 'standard';

function initLiveReview() {
    renderReviewTiers();
    const form = document.getElementById('review-form');
    if (form) form.addEventListener('submit', handleReviewSubmit);
    document.querySelectorAll('input[name="content-type"]').forEach(r => {
        r.addEventListener('change', toggleContentType);
    });
    toggleContentType();
}

function renderReviewTiers() {
    const el = document.getElementById('review-tiers');
    if (!el) return;
    el.innerHTML = Object.values(REVIEW_TIERS).map(t => `
        <button type="button" class="review-tier-card${selectedReviewTier === t.id ? ' active' : ''}"
                onclick="selectReviewTier('${t.id}')">
            ${t.badge ? `<span class="tier-badge">${t.badge}</span>` : ''}
            <i class="fa-solid ${t.icon} tier-icon"></i>
            <div class="tier-label">${t.label}</div>
            <div class="tier-price">$${t.price}</div>
            <div class="tier-desc">${t.desc}</div>
        </button>
    `).join('');
    const btn = document.getElementById('review-submit-btn');
    if (btn) btn.textContent = `Submit & Pay $${REVIEW_TIERS[selectedReviewTier].price}`;
}

function selectReviewTier(id) {
    selectedReviewTier = id;
    renderReviewTiers();
}

function toggleContentType() {
    const type = document.querySelector('input[name="content-type"]:checked')?.value || 'link';
    document.getElementById('review-link-field').style.display = type === 'link' ? 'block' : 'none';
    document.getElementById('review-video-field').style.display = type === 'video' ? 'block' : 'none';
}

function previewReviewVideo(input) {
    const file = input.files[0];
    const info = document.getElementById('review-video-info');
    if (!file) { info.textContent = ''; return; }
    const mb = (file.size / 1024 / 1024).toFixed(1);
    info.textContent = `${file.name} (${mb} MB)`;
    if (file.size > 50 * 1024 * 1024) {
        showToast('Video max 50MB — try a link instead');
        input.value = '';
        info.textContent = '';
    }
}

async function handleReviewSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('review-name').value.trim();
    const email = document.getElementById('review-email').value.trim();
    const artist = document.getElementById('review-artist').value.trim();
    const title = document.getElementById('review-title').value.trim();
    const notes = document.getElementById('review-notes').value.trim();
    const contentType = document.querySelector('input[name="content-type"]:checked')?.value || 'link';
    const contentUrl = document.getElementById('review-link').value.trim();
    const videoFile = document.getElementById('review-video').files[0];

    if (!name || !email) return showToast('Name and email required');
    if (!artist || !title) return showToast('Artist name and content title required');
    if (contentType === 'link' && !contentUrl) return showToast('Paste your video link');
    if (contentType === 'video' && !videoFile) return showToast('Upload your video file');

    const tier = REVIEW_TIERS[selectedReviewTier];
    const formData = new FormData();
    formData.append('tier', selectedReviewTier);
    formData.append('name', name);
    formData.append('email', email);
    formData.append('artistName', artist);
    formData.append('title', title);
    formData.append('notes', notes);
    formData.append('phone', document.getElementById('review-phone')?.value.trim() || '');
    formData.append('notifyEmail', document.getElementById('review-notify-email')?.checked ? 'true' : 'false');
    formData.append('notifySms', document.getElementById('review-notify-sms')?.checked ? 'true' : 'false');
    formData.append('contentType', contentType);
    if (contentType === 'link') formData.append('contentUrl', contentUrl);
    if (contentType === 'video' && videoFile) formData.append('video', videoFile);

    try {
        const res = await fetch('/api/review/submit', { method: 'POST', body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Submit failed');

        const product = {
            id: 'review-' + selectedReviewTier,
            name: `Live Review — ${tier.label}`,
            price: tier.price,
            type: 'review',
            description: `${artist} — ${title}`,
            submissionId: data.submissionId
        };
        const customer = { email, name };

        if (!paymentConfig.paymentsEnabled) {
            const confirmed = await confirmReviewSubmission(data.submissionId, 'demo');
            document.getElementById('review-form').reset();
            toggleContentType();
            document.getElementById('review-video-info').textContent = '';
            showSubmissionSuccess(confirmed, data.submissionId, email);
            return;
        }

        openReviewPaymentModal(product, customer, data.submissionId);
    } catch (err) {
        showToast(err.message || 'Could not submit');
    }
}

function openReviewPaymentModal(product, customer, submissionId) {
    document.getElementById('review-pay-title').textContent = product.name;
    document.getElementById('review-pay-price').textContent = '$' + product.price;
    document.getElementById('review-pay-desc').textContent = product.description;
    const btns = document.getElementById('review-pay-buttons');
    btns.innerHTML = `
        <button class="checkout-btn-primary" onclick="payForReview('stripe','${submissionId}')"><i class="fa-brands fa-stripe"></i> Pay with Card</button>
        <button class="checkout-btn-paypal" onclick="payForReview('paypal','${submissionId}')"><i class="fa-brands fa-paypal"></i> Pay with PayPal</button>
        <button class="checkout-btn-secondary" onclick="closeReviewPayment()">Cancel</button>`;
    window._reviewCheckout = { product, customer, submissionId };
    document.getElementById('review-pay-overlay').classList.add('open');
}

function closeReviewPayment() {
    document.getElementById('review-pay-overlay').classList.remove('open');
    window._reviewCheckout = null;
}

async function payForReview(provider, submissionId) {
    const ctx = window._reviewCheckout;
    if (!ctx) return;
    try {
        if (provider === 'stripe') {
            const res = await fetch('/api/checkout/stripe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    product: { ...ctx.product, submissionId },
                    customer: ctx.customer
                })
            });
            const data = await res.json();
            if (!res.ok) {
                if (data.demo) {
                    const confirmed = await confirmReviewSubmission(submissionId, 'demo');
                    closeReviewPayment();
                    showSubmissionSuccess(confirmed, submissionId, ctx.customer.email);
                    return;
                }
                throw new Error(data.error);
            }
            window.location.href = data.url;
        } else {
            const res = await fetch('/api/checkout/paypal/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ product: { ...ctx.product, submissionId }, customer: ctx.customer })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            if (data.approveUrl) window.location.href = data.approveUrl;
        }
    } catch (err) {
        showToast(err.message || 'Payment failed');
    }
}

async function confirmReviewSubmission(submissionId, provider) {
    const res = await fetch(`/api/review/confirm/${submissionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentProvider: provider })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Confirm failed');
    return data;
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('review-section')) initLiveReview();
});