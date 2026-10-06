/* Season 1 Finale · The Light Realm — three fan tiers on the prices page.
   Loaded after briunka-link.js; adds the tiers to the casting config, the section notes,
   the photo-email step in checkout, and the order-reference thank-you panel. */
(function () {
    const PHOTO_NOTE = 'After checkout: email 3–5 clear photos of your face to acrossthestars2026@gmail.com with your name, the platform the photos came from, and the tier you bought. Include the order reference from your thank-you page or Stripe receipt.';
    const BUNDLE_NOTE = 'If you purchase the $50 Finale Cameo, Photos with the Cast is included. Red Carpet Arrival and Photos with the Cast can also be bought on their own.';
    const ORDER_KEY = 'briunkaFinaleOrder';
    const REF_RE = /^cs_(live|test)_[A-Za-z0-9]+$/;
    const TIER_NAMES = { 'ats-finale-red-carpet': 'Red Carpet Arrival', 'ats-finale-cast-photos': 'Photos with the Cast', 'ats-finale-appearance': 'Finale Cameo' };
    const TIERS = [
        { id: 'ats-finale-red-carpet', name: 'Red Carpet Arrival', movie: 'Across the Stars: The Light Realm', position: 'Season 1 Finale · Red Carpet', description: 'Arrive at the Season 1 finale red carpet, walking in while photographers snap your picture. Email us your photos after checkout — we craft your AI likeness into the finale.', price: 35, photoTier: 'Red Carpet', category: 'finale', requiresPhotos: true, type: 'casting', image: '', visible: true },
        { id: 'ats-finale-cast-photos', name: 'Photos with the Cast', movie: 'Across the Stars: The Light Realm', position: 'Season 1 Finale · Cast Photos', description: 'Appear in the Season 1 finale taking pictures with the cast — Bri, M and the family. Email us your photos after checkout — we craft your AI likeness into the finale.', price: 40, photoTier: 'Cast Photos', category: 'finale', requiresPhotos: true, type: 'casting', image: '', visible: true },
        { id: 'ats-finale-appearance', name: 'Finale Cameo', movie: 'Across the Stars: The Light Realm', position: 'Season 1 Finale · Includes cast photos', description: 'Your cameo in the final episodes of Season 1, plus photos with the cast included. Email us your photos after checkout — we craft your AI likeness into the finale.', price: 50, photoTier: 'Finale Cameo', category: 'finale', requiresPhotos: true, type: 'casting', image: '', visible: true }
    ];

    if (typeof CAST_CATEGORIES === 'undefined' || typeof DEFAULT_CONFIG === 'undefined') return;

    if (!CAST_CATEGORIES.some(c => c.id === 'finale')) {
        const castIdx = CAST_CATEGORIES.findIndex(c => c.id === 'cast');
        CAST_CATEGORIES.splice(castIdx + 1, 0, { id: 'finale', label: 'Season 1 Finale · The Light Realm' });
    }
    const casting = DEFAULT_CONFIG.casting;
    if (!casting.some(c => c.id === TIERS[0].id)) {
        const after = casting.findIndex(c => c.id === 'ats-recurring');
        casting.splice(after >= 0 ? after + 1 : casting.length, 0, ...TIERS);
    }
    if (typeof config !== 'undefined' && config && Array.isArray(config.casting) && !config.casting.some(c => c.id === TIERS[0].id)) {
        config.casting = structuredClone(casting);
    }

    function photosMailto(tier) {
        const subject = 'Season Finale photos' + (tier ? ' – ' + tier : '');
        const body = 'Order reference:\nName:\nPlatform the photos came from:\nTier purchased:' + (tier ? ' ' + tier : '') + '\n(attach 3–5 photos)';
        return 'mailto:' + CONTACT_EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    }

    function addSectionNotes() {
        const cat = document.getElementById('offer-finale');
        if (!cat || cat.querySelector('.finale-notes')) return;
        const label = cat.querySelector('.section-label');
        const notes = document.createElement('div');
        notes.className = 'finale-notes';
        notes.innerHTML = `<p class="casting-intro">${esc(BUNDLE_NOTE)}</p>
            <p class="casting-intro">${esc(PHOTO_NOTE)}</p>
            <a class="buy-btn casting-btn" style="display:block;text-align:center;text-decoration:none;margin-bottom:1rem" href="${esc(photosMailto(''))}">Send my photos</a>`;
        if (label) label.after(notes); else cat.prepend(notes);
    }

    function renderThanks() {
        if (document.getElementById('finale-thanks')) return;
        const params = new URLSearchParams(location.search);
        let order = null;
        const ref = params.get('ref') || '';
        if (REF_RE.test(ref)) {
            const tierId = params.get('finale') || '';
            order = { ref, tierId: TIER_NAMES[tierId] ? tierId : '' };
            try { localStorage.setItem(ORDER_KEY, JSON.stringify(order)); } catch { /* private mode */ }
        } else if (params.has('finale') || location.hash === '#finale-thanks') {
            try {
                const saved = JSON.parse(localStorage.getItem(ORDER_KEY) || 'null');
                if (saved && REF_RE.test(saved.ref || '')) order = { ref: saved.ref, tierId: TIER_NAMES[saved.tierId] ? saved.tierId : '' };
            } catch { /* ignore */ }
        }
        if (!order) return;
        const tier = TIER_NAMES[order.tierId] || 'Season Finale';
        const shortRef = 'FIN-' + order.ref.slice(-8).toUpperCase();
        const subject = 'Season Finale photos – ' + shortRef + ' – ' + tier;
        const body = 'Order reference: ' + shortRef + '\nFull order ID: ' + order.ref + '\nTier: ' + tier + '\nName:\nPlatform the photos came from:\nEmail used at checkout:\n(attach 3–5 clear photos of your face)';
        const mailto = 'mailto:' + CONTACT_EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
        const panel = document.createElement('section');
        panel.id = 'finale-thanks';
        panel.className = 'casting-category';
        panel.style.scrollMarginTop = '1rem';
        panel.innerHTML = `<p class="section-label">Thank you</p>
            <div class="casting-card casting-card-compact"><div class="casting-body">
                <div class="casting-position">Season 1 Finale · ${esc(tier)}</div>
                <div class="casting-name serif">Your order reference: ${esc(shortRef)}</div>
                <p class="casting-desc">Next step: email 3–5 clear photos of your face to ${esc(CONTACT_EMAIL)} with your name, the platform the photos came from, the tier you bought and your order reference.</p>
                <a class="buy-btn casting-btn" style="display:block;text-align:center;text-decoration:none" href="${esc(mailto)}">Send my photos</a>
            </div></div>`;
        const anchor = document.getElementById('price-sheet-section') || document.getElementById('casting-section');
        if (anchor) anchor.before(panel);
    }

    const SUPPORT_URL = 'https://donate.stripe.com/7sY3cvbwJfK54CN1Gq8og0v';
    function addSupportBlock() {
        const cat = document.getElementById('offer-finale');
        if (!cat || document.getElementById('support-series')) return;
        const block = document.createElement('div');
        block.className = 'casting-category';
        block.id = 'support-series';
        block.innerHTML = `<p class="section-label">Support the Series</p>
            <p class="casting-intro">Love Across the Stars? Chip in any amount to help us make more episodes.</p>
            <a class="buy-btn casting-btn" style="display:block;text-align:center;text-decoration:none" href="${esc(SUPPORT_URL)}" target="_blank" rel="noopener">Donate any amount</a>
            <p class="casting-intro" style="margin-top:0.6rem;text-align:center">Give over $25 and your name will be listed in the credits as a sponsor of the next episode.</p>`;
        cat.after(block);
    }

    const baseRender = render;
    render = function () {
        baseRender.apply(this, arguments);
        addSectionNotes();
        addSupportBlock();
        renderThanks();
    };

    const baseOpenCheckout = openCheckout;
    openCheckout = function (productId, isCasting) {
        baseOpenCheckout.apply(this, arguments);
        const p = checkoutProduct;
        if (!p || !p.photoTier) return;
        const btns = document.getElementById('payment-buttons');
        if (!btns) return;
        btns.querySelectorAll('.checkout-demo-note').forEach(n => n.remove());
        btns.insertAdjacentHTML('beforeend', `<p class="checkout-demo-note">${esc(PHOTO_NOTE)}</p>
            <a class="checkout-btn-paypal" style="display:block;text-align:center;text-decoration:none" href="${esc(photosMailto(p.photoTier))}">Send my photos</a>`);
    };
})();
