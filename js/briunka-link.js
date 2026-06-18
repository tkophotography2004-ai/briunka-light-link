const STORAGE_KEY = 'briunkaLightLinkConfig_v2';

const CAST_CATEGORIES = [
    { id: 'cast', label: 'Cast & Character Packages' },
    { id: 'addon', label: 'Add-On Experiences' },
    { id: 'music', label: 'Music Artist Opportunities' },
    { id: 'business', label: 'Business & Brand Packages' },
    { id: 'support', label: 'Support the Movement' }
];

const PACKAGE_INCLUDES = [
    'Historic Certificate of participation',
    'Digital Character Card (personalized)',
    'Community Recognition in credits & posts',
    'Behind-the-Scenes access & production insights'
];

const ARTWORK = [
    { src: 'assets/images/briunka-belight.png', label: 'Be Light' },
    { src: 'assets/images/briunka-halo.png', label: 'Halo' },
    { src: 'assets/images/briunka-city.png', label: 'City Lights' },
    { src: 'assets/images/briunka-stairs.png', label: 'Ascension' },
    { src: 'assets/images/briunka-jungle.png', label: 'Jungle Queen' },
    { src: 'assets/images/briunka-cross.png', label: 'Divine Cross' }
];

const DEFAULT_CONFIG = {
    name: 'Briunka Light',
    tagline: 'Across the Stars · Light Works Entertainment',
    bio: 'The First Community Powered AI Cinematic Universe. Be part of history. Build the future. Leave a legacy.',
    avatar: 'assets/images/briunka-halo.png',
    heroArt: 0,
    priceSheet: 'assets/images/across-the-stars-price-sheet.jpg',
    contactEmail: 'acrossthestars2026@gmail.com',
    socials: [
        { id: 'tt-main', icon: 'fa-tiktok', url: 'https://www.tiktok.com/@briunkalightofficial', label: 'TikTok Main', shortLabel: '@briunkalightofficial', visible: true },
        { id: 'tt-backup', icon: 'fa-tiktok', url: 'https://www.tiktok.com/@briunkalightbackup', label: 'TikTok Backup', shortLabel: '@briunkalightbackup', visible: true },
        { id: 'tt-film', icon: 'fa-tiktok', url: 'https://www.tiktok.com/@lightworksunivers', label: 'Light Works Film', shortLabel: '@lightworksunivers', visible: true },
        { id: 'ig', icon: 'fa-instagram', url: 'https://instagram.com', label: 'Instagram', shortLabel: 'Instagram', visible: false },
        { id: 'sp', icon: 'fa-spotify', url: 'https://open.spotify.com', label: 'Spotify', shortLabel: 'Spotify', visible: false },
        { id: 'yt', icon: 'fa-youtube', url: 'https://youtube.com', label: 'YouTube', shortLabel: 'YouTube', visible: false },
        { id: 'x', icon: 'fa-x-twitter', url: 'https://x.com', label: 'X', shortLabel: 'X', visible: false }
    ],
    links: [
        {
            id: 'live-review',
            title: 'Submit for Live Review',
            subtitle: 'AI artists & creators — from $5 · Skip the line $10/$15',
            url: '#review-section',
            icon: 'fa-tower-broadcast',
            featured: true,
            visible: true,
            group: 'featured'
        },
        {
            id: 'ats',
            title: 'Across the Stars — Join the Cast',
            subtitle: 'Cameo from $75 · Be part of the AI cinematic universe',
            url: '#casting-section',
            icon: 'fa-star',
            visible: true,
            group: 'experiences'
        },
        {
            id: 'pricesheet',
            title: 'Full Price List',
            subtitle: 'View all packages, music & business opportunities',
            url: '#price-sheet-section',
            icon: 'fa-list',
            visible: true,
            group: 'experiences'
        },
        {
            id: 'vault',
            title: 'Shop The Vault',
            subtitle: 'Beats, scores & healing frequencies',
            url: '../hitmaker-vault/index.html?mode=shop',
            icon: 'fa-store',
            visible: true,
            group: 'experiences'
        },
        {
            id: 'healing',
            title: 'Healing Frequency Portal',
            subtitle: 'Meditations, Solfeggio tones & sound baths',
            url: '../healing-frequency-portal/index.html',
            icon: 'fa-spa',
            visible: true,
            group: 'experiences'
        },
        {
            id: 'studio',
            title: 'Canva Product Studio',
            subtitle: 'AI job tools, lookbooks & digital products',
            url: '../canva-product-studio/index.html',
            icon: 'fa-wand-magic-sparkles',
            visible: true,
            group: 'experiences'
        },
        {
            id: 'hitmaker',
            title: 'Hitmaker Vault Studio',
            subtitle: 'Surprise Me, Recipe Lab & Hook Maker',
            url: '../hitmaker-vault/index.html',
            icon: 'fa-infinity',
            visible: true,
            group: 'tools'
        }
    ],
    products: [],
    casting: [
        { id: 'ats-cameo', name: 'Cameo Spot', movie: 'Across the Stars', position: 'Cameo · 5–10 sec appearance', description: 'Appear in a future episode for 5–10 seconds. Upload your photos — we craft your AI likeness.', price: 75, category: 'cast', requiresPhotos: true, featured: true, type: 'casting', image: 'assets/images/briunka-belight.png', visible: true },
        { id: 'ats-featured', name: 'Featured Character', movie: 'Across the Stars', position: 'Speaking Role', description: 'Speaking role with custom character design. Be seen. Be remembered.', price: 150, category: 'cast', requiresPhotos: true, type: 'casting', image: 'assets/images/across-the-stars-price-sheet.jpg', visible: true },
        { id: 'ats-villain', name: 'Villain Package', movie: 'Across the Stars', position: 'Legendary Villain', description: 'Become a legendary villain. We\'ll create you. We\'ll defeat you. You\'ll be unforgettable.', price: 250, category: 'cast', requiresPhotos: true, type: 'casting', image: 'assets/images/briunka-city.png', visible: true },
        { id: 'ats-royal', name: 'Royal Family Package', movie: 'Across the Stars', position: 'Royal Family', description: 'Join the Royal Family — Kings, Queens, Princes, Princesses. Legacy is yours.', price: 300, category: 'cast', requiresPhotos: true, type: 'casting', image: 'assets/images/briunka-halo.png', visible: true },
        { id: 'ats-exec', name: 'Executive Producer', movie: 'Across the Stars', position: 'Executive Producer Credit', description: 'Executive Producer credit, VIP access, early previews, and exclusive behind-the-scenes.', price: 500, category: 'cast', requiresPhotos: false, type: 'casting', image: 'assets/images/across-the-stars-price-sheet.jpg', visible: true },
        { id: 'ats-recurring', name: 'Recurring Character', movie: 'Across the Stars', position: 'Multi-Episode Role', description: 'Become a recurring character across multiple episodes. Your story. Your legacy.', price: 750, priceLabel: '$750+', category: 'cast', requiresPhotos: true, type: 'casting', image: 'assets/images/briunka-stairs.png', visible: true },

        { id: 'ats-char-build', name: '1-on-1 Character Building', movie: 'Across the Stars', position: 'With Briunka Light', description: 'Private session to build your character with Briunka Light.', price: 100, category: 'addon', requiresPhotos: true, type: 'casting', image: '', visible: true },
        { id: 'ats-scene', name: 'Custom Scene Upgrade', movie: 'Across the Stars', position: 'Enhanced Visuals', description: 'Custom scenes with enhanced visuals for your character.', price: 150, priceLabel: '$150+', category: 'addon', requiresPhotos: true, type: 'casting', image: '', visible: true },
        { id: 'ats-poster', name: 'Signed Digital Poster', movie: 'Across the Stars', position: 'Limited Edition', description: 'Limited edition digital poster signed by Briunka Light.', price: 50, category: 'addon', requiresPhotos: false, type: 'casting', image: '', visible: true },

        { id: 'ats-song-review', name: 'Song Review', movie: 'Across the Stars', position: 'Music · Serious inquiries', description: 'Professional song review. Serious inquiries only — quality control applies.', price: 25, category: 'music', requiresPhotos: false, promoVideo: true, type: 'casting', image: '', visible: true },
        { id: 'ats-song-place', name: 'Song Placement', movie: 'Across the Stars', position: 'In an Episode', description: 'Your song placed in an Across the Stars episode.', price: 100, category: 'music', requiresPhotos: false, promoVideo: true, type: 'casting', image: '', visible: true },
        { id: 'ats-artist-spot', name: 'Featured Artist Spotlight', movie: 'Across the Stars', position: 'Artist Feature', description: 'Featured artist spotlight in the universe — AI music promo included.', price: 200, category: 'music', requiresPhotos: true, promoVideo: true, type: 'casting', image: '', visible: true },
        { id: 'ats-soundtrack', name: 'Official Soundtrack Partner', movie: 'Across the Stars', position: 'Soundtrack Partner', description: 'Multiple placements plus exclusive promotion across the series.', price: 500, category: 'music', requiresPhotos: false, promoVideo: true, type: 'casting', image: '', visible: true },

        { id: 'ats-biz-promo', name: 'Cinematic Business Promo', movie: 'Across the Stars', position: '15–30 sec luxury video', description: 'Luxury cinematic promo video for your business — AI-produced.', price: 150, category: 'business', requiresPhotos: true, type: 'casting', image: '', visible: true },
        { id: 'ats-biz-universe', name: 'Business in the Universe', movie: 'Across the Stars', position: 'In-Story Placement', description: 'Your business appears inside the Across the Stars story.', price: 300, category: 'business', requiresPhotos: false, type: 'casting', image: '', visible: true },
        { id: 'ats-grand-open', name: 'Grand Opening Package', movie: 'Across the Stars', position: 'Launch Package', description: 'Announcement video, social teaser, and custom visuals for your launch.', price: 500, category: 'business', requiresPhotos: false, type: 'casting', image: '', visible: true },
        { id: 'ats-brand', name: 'Brand Partnership', movie: 'Across the Stars', position: 'Integrated Placement', description: 'Integrated brand placement across multiple episodes.', price: 1000, priceLabel: '$1,000+', category: 'business', requiresPhotos: false, type: 'casting', image: '', visible: true },

        { id: 'ats-founding', name: 'Founding Supporter', movie: 'Across the Stars', position: 'Support the Movement', description: 'Support the movement and be part of something unforgettable.', price: 10, category: 'support', requiresPhotos: false, type: 'casting', image: '', visible: true },
        { id: 'ats-vip', name: 'VIP Insider Membership', movie: 'Across the Stars', position: 'Monthly Membership', description: 'Monthly access to exclusive content, votes, and VIP perks.', price: 9.99, priceLabel: '$9.99/mo', subscription: true, category: 'support', requiresPhotos: false, type: 'casting', image: '', visible: true },
        { id: 'ats-team', name: 'Support Team Member', movie: 'Across the Stars', position: 'Apply to Join', description: 'Join the Across the Stars support team. Apply to be part of the movement.', price: 0, category: 'support', applyOnly: true, requiresPhotos: false, type: 'casting', image: '', visible: true }
    ]
};

const GROUP_LABELS = {
    experiences: 'Experiences',
    tools: 'Creator Tools'
};

let config = structuredClone(DEFAULT_CONFIG);
let artIndex = 0;
let artTimer = null;
let checkoutProduct = null;
let checkoutIsCasting = false;

function loadConfig() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            config = {
                ...DEFAULT_CONFIG,
                ...parsed,
                socials: mergeSocials(parsed.socials),
                links: parsed.links || DEFAULT_CONFIG.links,
                products: parsed.products || DEFAULT_CONFIG.products,
                casting: mergeCasting(parsed.casting)
            };
        }
    } catch {
        config = structuredClone(DEFAULT_CONFIG);
    }
    artIndex = config.heroArt || 0;
}

function mergeCasting(saved) {
    if (!saved || !saved.length) return DEFAULT_CONFIG.casting;
    if (saved.length < 10 || saved.some(c => c.id === 'cast-costar')) return DEFAULT_CONFIG.casting;
    return saved;
}

function formatPrice(c) {
    if (c.priceLabel) return `<span class="price-sale">${esc(c.priceLabel)}</span>`;
    if (c.applyOnly) return `<span class="price-sale">Apply</span>`;
    if (c.onSale && c.originalPrice && c.originalPrice > c.price) {
        return `<span class="price-original">$${c.originalPrice}</span><span class="price-sale">$${c.price}</span>`;
    }
    if (c.subscription) return `<span class="price-sale">$${c.price}/mo</span>`;
    return `<span class="price-sale">$${c.price}</span>`;
}

function buyButtonLabel(c) {
    if (c.applyOnly) return 'Apply Now';
    if (c.subscription) return 'Subscribe';
    if (c.category === 'cast' || c.requiresPhotos) return 'Join — ' + (c.priceLabel || '$' + c.price);
    return 'Get It — ' + (c.priceLabel || '$' + c.price);
}

function mergeSocials(saved) {
    if (!saved) return DEFAULT_CONFIG.socials;
    const defaults = DEFAULT_CONFIG.socials;
    const cleaned = saved.filter(s => s.id !== 'tt');
    const merged = defaults.map(d => {
        const s = cleaned.find(x => x.id === d.id);
        if (!s) return d;
        const url = s.url && !s.url.endsWith('tiktok.com') ? s.url : d.url;
        return { ...d, ...s, url };
    });
    cleaned.filter(s => !defaults.find(d => d.id === s.id)).forEach(s => merged.push(s));
    return merged;
}

function saveConfig() {
    config.heroArt = artIndex;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2800);
}

function uid() {
    return 'id_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function esc(str) {
    const d = document.createElement('div');
    d.textContent = str || '';
    return d.innerHTML;
}

/* ── Art hero ── */
function initArtHero() {
    const hero = document.getElementById('art-hero');
    hero.innerHTML = ARTWORK.map((art, i) =>
        `<div class="art-slide${i === artIndex ? ' active' : ''}" style="background-image:url('${art.src}')" data-idx="${i}"></div>`
    ).join('');

    const dots = document.getElementById('art-dots');
    dots.innerHTML = ARTWORK.map((_, i) =>
        `<button class="art-dot${i === artIndex ? ' active' : ''}" data-idx="${i}" aria-label="Artwork ${i + 1}"></button>`
    ).join('');

    dots.querySelectorAll('.art-dot').forEach(dot => {
        dot.addEventListener('click', () => setArtSlide(parseInt(dot.dataset.idx)));
    });
    startArtRotation();
}

function setArtSlide(idx) {
    artIndex = idx;
    document.querySelectorAll('.art-slide').forEach((s, i) => s.classList.toggle('active', i === idx));
    document.querySelectorAll('.art-dot').forEach((d, i) => d.classList.toggle('active', i === idx));
    resetArtTimer();
}

function startArtRotation() {
    artTimer = setInterval(() => setArtSlide((artIndex + 1) % ARTWORK.length), 7000);
}

function resetArtTimer() {
    clearInterval(artTimer);
    startArtRotation();
}

function initParticles() {
    const container = document.getElementById('particles');
    for (let i = 0; i < 30; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = Math.random() * 100 + '%';
        p.style.top = 60 + Math.random() * 40 + '%';
        p.style.animationDelay = Math.random() * 8 + 's';
        p.style.animationDuration = 6 + Math.random() * 6 + 's';
        container.appendChild(p);
    }
}

/* ── Render ── */
function render() {
    document.getElementById('brand-name').textContent = config.name;
    document.getElementById('brand-tagline').textContent = config.tagline;
    document.getElementById('brand-bio').textContent = config.bio;

    const avatarEl = document.getElementById('avatar-img');
    if (config.avatar) {
        avatarEl.src = config.avatar;
        avatarEl.style.display = 'block';
        document.getElementById('avatar-fallback').style.display = 'none';
    } else {
        avatarEl.style.display = 'none';
        document.getElementById('avatar-fallback').style.display = 'flex';
    }

    renderSocials();
    renderLinks();
    renderCasting();
    renderProducts();
    renderFooter();
}

function renderFooter() {
    const email = config.contactEmail || 'acrossthestars2026@gmail.com';
    const el = document.getElementById('footer-contact');
    if (el) {
        el.innerHTML = `
            <a href="mailto:${email}">${email}</a>
            <span class="footer-hashtag">#ACROSSTHESTARS</span>`;
    }
}

function renderSocials() {
    const el = document.getElementById('social-bar');
    const visible = (config.socials || []).filter(s => s.visible);
    el.innerHTML = visible.map(s => {
        const isTikTok = s.icon === 'fa-tiktok';
        const cls = isTikTok ? 'social-pill social-pill-labeled' : 'social-pill';
        const label = isTikTok && s.shortLabel
            ? `<span class="social-label">${esc(s.shortLabel)}</span>` : '';
        return `
            <a href="${s.url}" target="_blank" rel="noopener" class="${cls}" title="${esc(s.label)}">
                <i class="fa-brands ${s.icon}"></i>${label}
            </a>`;
    }).join('');
}

function renderLinks() {
    const featured = config.links.find(l => l.featured && l.visible);
    document.getElementById('featured-section').innerHTML = featured
        ? buildLinkCard(featured, true, 2) : '';

    const groups = ['experiences', 'tools'];
    const container = document.getElementById('links-container');
    container.innerHTML = '';

    groups.forEach((group, gi) => {
        const items = config.links.filter(l => l.group === group && l.visible && !l.featured);
        if (!items.length) return;
        const section = document.createElement('div');
        section.className = `delay-${gi + 3}`;
        section.innerHTML = `<p class="section-label">${GROUP_LABELS[group] || group}</p>`;
        const list = document.createElement('div');
        items.forEach((link, li) => { list.innerHTML += buildLinkCard(link, false, gi + li + 3); });
        section.appendChild(list);
        container.appendChild(section);
    });

    const customLinks = config.links.filter(l => l.group === 'custom' && l.visible);
    if (customLinks.length) {
        const section = document.createElement('div');
        section.innerHTML = `<p class="section-label">My Links</p>`;
        const list = document.createElement('div');
        customLinks.forEach((link, i) => { list.innerHTML += buildLinkCard(link, false, i + 4); });
        section.appendChild(list);
        container.appendChild(section);
    }
}

function buildLinkCard(link, isFeatured, delay) {
    const cls = isFeatured ? 'link-card featured delay-' + delay : 'link-card delay-' + delay;
    const glow = isFeatured ? '<div class="link-glow"></div>' : '';
    const arrow = isFeatured
        ? '<span class="link-arrow">ENTER <i class="fa-solid fa-arrow-right"></i></span>'
        : '<i class="fa-solid fa-chevron-right link-arrow"></i>';
    const isHash = link.url.startsWith('#');
    const external = link.url.startsWith('http') ? 'target="_blank" rel="noopener"' : '';

    return `
        <a href="${link.url}" class="${cls}" ${external} ${isHash ? 'onclick="event.preventDefault();document.querySelector(\'' + link.url + '\').scrollIntoView({behavior:\'smooth\'})"' : ''}>
            ${glow}
            <div class="link-inner">
                <div class="link-icon"><i class="fa-solid ${link.icon || 'fa-link'}"></i></div>
                <div class="link-text">
                    <div class="link-title">${esc(link.title)}</div>
                    <div class="link-subtitle">${esc(link.subtitle || '')}</div>
                </div>
                ${arrow}
            </div>
        </a>`;
}

function renderPriceSheet() {
    const section = document.getElementById('price-sheet-section');
    const img = document.getElementById('price-sheet-img');
    if (!section || !config.priceSheet) return;
    img.src = config.priceSheet;
    img.alt = 'Across the Stars Price List';
    section.style.display = 'block';
}

function renderCasting() {
    const section = document.getElementById('casting-section');
    const grid = document.getElementById('casting-grid');
    const roles = (config.casting || []).filter(c => c.visible);

    renderPriceSheet();

    if (!roles.length) {
        section.style.display = 'none';
        return;
    }
    section.style.display = 'block';

    const includesEl = document.getElementById('package-includes');
    if (includesEl) {
        includesEl.innerHTML = PACKAGE_INCLUDES.map(i =>
            `<li><i class="fa-solid fa-star"></i> ${esc(i)}</li>`
        ).join('');
    }

    let html = '';
    let delay = 0;

    CAST_CATEGORIES.forEach(cat => {
        const items = roles.filter(c => c.category === cat.id);
        if (!items.length) return;

        const featured = items.find(c => c.featured);
        const rest = items.filter(c => !c.featured);

        html += `<div class="casting-category"><p class="section-label">${cat.label}</p>`;
        if (featured) html += buildCastingCard(featured, delay++, true);
        html += `<div class="casting-list">${rest.map(c => buildCastingCard(c, delay++, false, true)).join('')}</div>`;
        html += '</div>';
    });

    grid.innerHTML = html;
}

function buildCastingCard(c, i, isFeatured, compact) {
    const img = c.image
        ? `<img src="${c.image}" alt="${esc(c.name)}">`
        : `<div class="casting-img-placeholder"><i class="fa-solid ${c.promoVideo ? 'fa-music' : c.category === 'business' ? 'fa-briefcase' : 'fa-film'}"></i></div>`;
    const saleBadge = c.onSale ? '<span class="sale-badge">SALE</span>' : '';
    const promoTag = c.promoVideo ? '<span class="promo-tag"><i class="fa-solid fa-music"></i> Music</span>' : '';
    const cls = isFeatured ? 'casting-card casting-card-featured' : compact ? 'casting-card casting-card-compact' : 'casting-card';
    const uploadHint = c.requiresPhotos
        ? '<p class="casting-upload-hint"><i class="fa-solid fa-camera"></i> Upload your photos for AI likeness</p>' : '';
    const imgBlock = compact ? '' : `<div class="casting-img">${img}
                <span class="casting-movie">${esc(c.movie)}</span>
                ${saleBadge}${promoTag}
            </div>`;

    return `
        <div class="${cls} delay-${(i % 3) + 2}">
            ${imgBlock}
            <div class="casting-body">
                <div class="casting-position">${esc(c.position)}</div>
                <div class="casting-name serif">${esc(c.name)}</div>
                <p class="casting-desc">${esc(c.description)}</p>
                ${uploadHint}
                <div class="casting-meta">
                    <div class="casting-price-wrap">${formatPrice(c)}</div>
                </div>
                <button class="buy-btn casting-btn" onclick="openCheckout('${c.id}', true)">
                    ${buyButtonLabel(c)}
                </button>
            </div>
        </div>`;
}

function openPriceSheetLightbox() {
    document.getElementById('price-sheet-lightbox').classList.add('open');
}

function closePriceSheetLightbox() {
    document.getElementById('price-sheet-lightbox').classList.remove('open');
}

function renderProducts() {
    const el = document.getElementById('product-grid');
    const products = (config.products || []).filter(p => p.visible);

    if (!products.length) {
        document.getElementById('shop-section').style.display = 'none';
        return;
    }
    document.getElementById('shop-section').style.display = 'block';

    el.innerHTML = products.map((p, i) => {
        const imgContent = p.image
            ? `<img src="${p.image}" alt="${esc(p.name)}">`
            : `<div class="product-img-placeholder"><i class="fa-solid ${p.type === 'digital' ? 'fa-cloud-arrow-down' : 'fa-box'}"></i></div>`;

        return `
            <div class="product-card delay-${(i % 4) + 2}">
                <div class="product-img">${imgContent}
                    <span class="product-badge">${p.type}</span>
                </div>
                <div class="product-body">
                    <div class="product-name">${esc(p.name)}</div>
                    <div class="product-price">$${p.price}</div>
                    <button class="buy-btn" onclick="openCheckout('${p.id}', false)">Buy Now</button>
                </div>
            </div>`;
    }).join('');
}

/* ── Email capture ── */
async function handleEmailSignup(e) {
    e.preventDefault();
    const email = document.getElementById('email-input').value.trim();
    const name = document.getElementById('email-name-input').value.trim();
    if (!email) return showToast('Enter your email');

    try {
        await subscribeEmail(email, name, 'bio-newsletter');
        document.getElementById('email-form').reset();
        showToast('Welcome to the LIGHT list ✦');
    } catch (err) {
        showToast(err.message || 'Could not subscribe');
    }
}

/* ── Checkout ── */
function openCheckout(productId, isCasting) {
    checkoutIsCasting = isCasting;
    const list = isCasting ? config.casting : config.products;
    checkoutProduct = list.find(p => p.id === productId);
    if (!checkoutProduct) return;

    document.getElementById('checkout-title').textContent = checkoutProduct.name;
    document.getElementById('checkout-price').innerHTML = formatPrice(checkoutProduct);

    const castingFields = document.getElementById('casting-fields');
    const standardDesc = document.getElementById('checkout-desc');
    const castingInfo = document.getElementById('casting-checkout-info');
    const paymentBtns = document.getElementById('payment-buttons');

    if (checkoutProduct.applyOnly) {
        const email = config.contactEmail || 'acrossthestars2026@gmail.com';
        window.location.href = `mailto:${email}?subject=${encodeURIComponent('Across the Stars — ' + checkoutProduct.name)}&body=${encodeURIComponent('Hi Briunka,\n\nI would like to apply for: ' + checkoutProduct.name + '\n\nName:\nEmail:\nWhy I want to join:\n')}`;
        return;
    }

    if (isCasting) {
        const needsPhotos = checkoutProduct.requiresPhotos;
        castingFields.style.display = needsPhotos ? 'block' : 'none';
        standardDesc.style.display = 'none';
        castingInfo.style.display = 'block';
        castingInfo.innerHTML = `
            <strong>${esc(checkoutProduct.movie)}</strong> · ${esc(checkoutProduct.position)}<br>
            <span style="color:var(--muted);font-size:0.75rem">${esc(checkoutProduct.description)}</span>
            ${checkoutProduct.promoVideo ? '<br><span class="promo-inline"><i class="fa-solid fa-music"></i> AI music artist promo option</span>' : ''}
            ${checkoutProduct.subscription ? '<br><span class="promo-inline"><i class="fa-solid fa-crown"></i> Monthly VIP membership</span>' : ''}`;
        if (checkoutProduct.image) {
            document.getElementById('checkout-product-img').src = checkoutProduct.image;
            document.getElementById('checkout-product-img').style.display = 'block';
        } else {
            document.getElementById('checkout-product-img').style.display = 'none';
        }
    } else {
        castingFields.style.display = 'none';
        standardDesc.style.display = 'block';
        castingInfo.style.display = 'none';
        standardDesc.textContent = checkoutProduct.type === 'digital'
            ? 'Instant digital delivery. Download link sent to your email.'
            : 'Physical product — ships within 5–7 business days.';
        document.getElementById('checkout-product-img').style.display = checkoutProduct.image ? 'block' : 'none';
        if (checkoutProduct.image) document.getElementById('checkout-product-img').src = checkoutProduct.image;
    }

    document.getElementById('checkout-email').value = '';
    document.getElementById('checkout-name').value = '';
    document.getElementById('checkout-phone').value = '';
    document.getElementById('checkout-instagram').value = '';
    document.getElementById('checkout-notes').value = '';
    document.getElementById('ref-photos-grid').innerHTML = '';
    window._refPhotos = [];
    document.getElementById('checkout-ref-photo').value = '';

    const hasPayments = paymentConfig.paymentsEnabled;
    paymentBtns.innerHTML = hasPayments ? `
        <button class="checkout-btn-primary" onclick="completePurchase('stripe')"><i class="fa-brands fa-stripe"></i> Pay with Card</button>
        <button class="checkout-btn-paypal" onclick="completePurchase('paypal')"><i class="fa-brands fa-paypal"></i> Pay with PayPal</button>
    ` : `
        <button class="checkout-btn-primary" onclick="completePurchase('demo')">Complete Order</button>
        <p class="checkout-demo-note">Add Stripe/PayPal keys to .env to enable live payments</p>`;

    document.getElementById('checkout-overlay').classList.add('open');
}

function closeCheckout() {
    document.getElementById('checkout-overlay').classList.remove('open');
    checkoutProduct = null;
    checkoutIsCasting = false;
}

window._refPhotos = [];

function previewRefPhoto(input) {
    const files = Array.from(input.files || []);
    if (!files.length) return;
    const grid = document.getElementById('ref-photos-grid');
    const max = 5;

    files.slice(0, max - window._refPhotos.length).forEach(file => {
        if (file.size > 3 * 1024 * 1024) {
            showToast('Each photo max 3MB');
            return;
        }
        const reader = new FileReader();
        reader.onload = e => {
            window._refPhotos.push(e.target.result);
            const idx = window._refPhotos.length - 1;
            grid.innerHTML += `
                <div class="ref-photo-item" data-idx="${idx}">
                    <img src="${e.target.result}" alt="Your photo">
                    <button type="button" class="ref-photo-remove" onclick="removeRefPhoto(${idx})">×</button>
                </div>`;
        };
        reader.readAsDataURL(file);
    });
    input.value = '';
}

function removeRefPhoto(idx) {
    window._refPhotos[idx] = null;
    const grid = document.getElementById('ref-photos-grid');
    grid.querySelectorAll('.ref-photo-item').forEach(el => {
        if (parseInt(el.dataset.idx) === idx) el.remove();
    });
}

async function completePurchase(provider) {
    if (!checkoutProduct) return;

    const email = document.getElementById('checkout-email').value.trim();
    const name = document.getElementById('checkout-name').value.trim();

    if (!email || !name) {
        showToast('Name and email required');
        return;
    }

    const refPhotos = (window._refPhotos || []).filter(Boolean);

    if (checkoutIsCasting && checkoutProduct.requiresPhotos && !refPhotos.length) {
        showToast('Upload your photos for the AI film');
        return;
    }

    const customer = {
        email,
        name,
        phone: document.getElementById('checkout-phone').value.trim(),
        instagram: document.getElementById('checkout-instagram').value.trim(),
        notes: document.getElementById('checkout-notes').value.trim(),
        referencePhoto: refPhotos[0] || '',
        referencePhotos: refPhotos
    };

    const product = { ...checkoutProduct };

    try {
        if (provider === 'demo') {
            if (checkoutIsCasting) await submitCastingApplication({ ...customer, product, paymentProvider: 'demo' });
            showToast('Order placed! We\'ll be in touch.');
            if (checkoutIsCasting && checkoutProduct.spotsLeft > 0) {
                checkoutProduct.spotsLeft--;
                saveConfig();
            }
            closeCheckout();
            renderCasting();
            return;
        }

        const result = await processCheckout(product, customer, provider);
        if (result?.demo) {
            showToast('Payments not configured — use demo mode');
        }
    } catch (err) {
        showToast(err.message || 'Payment failed');
    }
}

/* ── Studio ── */
function toggleStudio() {
    const overlay = document.getElementById('studio-overlay');
    const isOpen = overlay.classList.contains('open');
    overlay.classList.toggle('open');
    if (!isOpen) populateStudio();
}

function switchTab(tab) {
    document.querySelectorAll('.studio-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
    document.querySelectorAll('.studio-tab-content').forEach(c => c.classList.toggle('active', c.id === 'tab-' + tab));
}

function populateStudio() {
    document.getElementById('edit-name').value = config.name;
    document.getElementById('edit-tagline').value = config.tagline;
    document.getElementById('edit-bio').value = config.bio;
    renderEditLinks();
    renderEditSocials();
    renderEditProducts();
    renderEditCasting();
    loadPaymentStatus();
}

async function loadPaymentStatus() {
    const box = document.getElementById('payment-status');
    try {
        const res = await fetch('/api/health');
        const h = await res.json();
        box.innerHTML = `
            <div class="pay-status-row"><span>Stripe</span><span class="${h.stripe ? 'pay-on' : 'pay-off'}">${h.stripe ? '● Connected' : '○ Not configured'}</span></div>
            <div class="pay-status-row"><span>PayPal</span><span class="${h.paypal ? 'pay-on' : 'pay-off'}">${h.paypal ? '● Connected' : '○ Not configured'}</span></div>`;
        document.getElementById('pay-site-url').value = h.site_url || 'http://localhost:8847';
    } catch {
        box.innerHTML = '<p class="studio-hint">Start the server to configure payments.</p>';
    }
}

async function savePaymentKeys() {
    const payload = {
        stripePublishableKey: document.getElementById('pay-stripe-pub').value.trim(),
        stripeSecretKey: document.getElementById('pay-stripe-secret').value.trim(),
        stripeWebhookSecret: document.getElementById('pay-stripe-webhook').value.trim(),
        paypalClientId: document.getElementById('pay-paypal-id').value.trim(),
        paypalClientSecret: document.getElementById('pay-paypal-secret').value.trim(),
        paypalMode: document.getElementById('pay-paypal-mode').value,
        siteUrl: document.getElementById('pay-site-url').value.trim()
    };
    try {
        const res = await fetch('/api/admin/save-keys', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed');
        showToast('Payment keys saved — restart server');
        await loadPaymentConfig();
        loadPaymentStatus();
    } catch (err) {
        showToast(err.message || 'Could not save keys');
    }
}

function renderEditLinks() {
    document.getElementById('edit-links-list').innerHTML = config.links.map((link, i) => `
        <div class="edit-item">
            <div class="edit-item-header">
                <span class="edit-item-title">${esc(link.title)}</span>
                <div class="edit-item-actions">
                    <label class="toggle-check" style="font-size:0.625rem;color:var(--muted)">
                        <input type="checkbox" data-link-vis="${i}" ${link.visible ? 'checked' : ''}> Show
                    </label>
                    ${link.group === 'custom' ? `<button class="icon-btn" onclick="removeLink(${i})"><i class="fa-solid fa-trash"></i></button>` : ''}
                </div>
            </div>
            <input class="field-input" style="margin-bottom:0.5rem" data-link-title="${i}" value="${esc(link.title)}" placeholder="Title">
            <input class="field-input" style="margin-bottom:0.5rem" data-link-sub="${i}" value="${esc(link.subtitle || '')}" placeholder="Subtitle">
            <input class="field-input" style="margin-bottom:0" data-link-url="${i}" value="${esc(link.url)}" placeholder="URL">
        </div>`).join('');
}

function renderEditSocials() {
    document.getElementById('edit-socials-list').innerHTML = config.socials.map((s, i) => `
        <div class="edit-item">
            <div class="edit-item-header">
                <span class="edit-item-title"><i class="fa-brands ${s.icon}"></i> ${esc(s.label)}</span>
                <div class="edit-item-actions">
                    <label class="toggle-check" style="font-size:0.625rem;color:var(--muted)">
                        <input type="checkbox" data-social-vis="${i}" ${s.visible ? 'checked' : ''}> Show
                    </label>
                    <button class="icon-btn" onclick="removeSocial(${i})"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>
            <input class="field-input" style="margin-bottom:0.5rem" data-social-url="${i}" value="${esc(s.url)}" placeholder="Profile URL">
            <input class="field-input" style="margin-bottom:0" data-social-label="${i}" value="${esc(s.shortLabel || s.label)}" placeholder="Display label">
        </div>`).join('');
}

function renderEditProducts() {
    document.getElementById('edit-products-list').innerHTML = config.products.map((p, i) => buildProductEditor(p, i, 'products')).join('');
}

function renderEditCasting() {
    document.getElementById('edit-casting-list').innerHTML = config.casting.map((c, i) => `
        <div class="edit-item casting-editor">
            <div class="edit-item-header">
                <span class="edit-item-title"><i class="fa-solid fa-film"></i> ${esc(c.name)}</span>
                <div class="edit-item-actions">
                    <label class="toggle-check" style="font-size:0.625rem;color:var(--muted)">
                        <input type="checkbox" data-cast-vis="${i}" ${c.visible ? 'checked' : ''}> Show
                    </label>
                    <button class="icon-btn" onclick="removeCasting(${i})"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>
            <input class="field-input" style="margin-bottom:0.5rem" data-cast-name="${i}" value="${esc(c.name)}" placeholder="Role name">
            <input class="field-input" style="margin-bottom:0.5rem" data-cast-movie="${i}" value="${esc(c.movie)}" placeholder="Movie / Series title">
            <input class="field-input" style="margin-bottom:0.5rem" data-cast-position="${i}" value="${esc(c.position)}" placeholder="Position (e.g. Lead, Cameo)">
            <textarea class="field-input" style="margin-bottom:0.5rem" data-cast-desc="${i}" rows="2" placeholder="Description">${esc(c.description)}</textarea>
            <div class="field-row">
                <input class="field-input" data-cast-price="${i}" type="number" value="${c.price}" placeholder="Sale price">
                <input class="field-input" data-cast-orig="${i}" type="number" value="${c.originalPrice || ''}" placeholder="Regular price">
            </div>
            <div class="field-row">
                <select class="field-input" data-cast-cat="${i}">
                    ${CAST_CATEGORIES.map(cat => `<option value="${cat.id}" ${c.category === cat.id ? 'selected' : ''}>${cat.label}</option>`).join('')}
                </select>
                <input class="field-input" data-cast-label="${i}" value="${esc(c.priceLabel || '')}" placeholder="Price label e.g. $750+">
            </div>
            <div class="field-row">
                <label class="toggle-check" style="display:flex;align-items:center;gap:0.5rem;font-size:0.75rem;color:var(--muted);padding:0.5rem">
                    <input type="checkbox" data-cast-photos="${i}" ${c.requiresPhotos ? 'checked' : ''}> Requires Photo Upload
                </label>
                <label class="toggle-check" style="display:flex;align-items:center;gap:0.5rem;font-size:0.75rem;color:var(--muted);padding:0.5rem">
                    <input type="checkbox" data-cast-promo="${i}" ${c.promoVideo ? 'checked' : ''}> Music Promo
                </label>
            </div>
            <label class="field-label" style="margin-top:0.5rem">Cover Image</label>
            <label class="upload-zone" style="padding:0.75rem;margin-bottom:0.5rem">
                <i class="fa-solid fa-image" style="font-size:1rem;margin-bottom:0.25rem"></i>
                <p style="font-size:0.6875rem">${c.image ? 'Change cover image' : 'Upload cover image'}</p>
                <input type="file" accept="image/*" onchange="uploadCastingImage(${i}, 'cover', this)">
            </label>
            ${c.image ? `<img src="${c.image}" class="edit-thumb" alt="cover">` : ''}
            <label class="field-label">Gallery Images (scene previews)</label>
            <label class="upload-zone" style="padding:0.75rem;margin-bottom:0.5rem">
                <i class="fa-solid fa-images" style="font-size:1rem;margin-bottom:0.25rem"></i>
                <p style="font-size:0.6875rem">Add gallery image</p>
                <input type="file" accept="image/*" onchange="uploadCastingImage(${i}, 'gallery', this)">
            </label>
            <div class="gallery-thumbs" id="gallery-thumbs-${i}">
                ${(c.gallery || []).map((g, gi) => `
                    <div class="gallery-thumb-wrap">
                        <img src="${g}" class="edit-thumb" alt="gallery">
                        <button class="gallery-remove" onclick="removeGalleryImage(${i}, ${gi})">×</button>
                    </div>`).join('')}
            </div>
        </div>`).join('');
}

function buildProductEditor(p, i, list) {
    return `
        <div class="edit-item">
            <div class="edit-item-header">
                <span class="edit-item-title">${esc(p.name)}</span>
                <div class="edit-item-actions">
                    <label class="toggle-check" style="font-size:0.625rem;color:var(--muted)">
                        <input type="checkbox" data-prod-vis="${i}" ${p.visible ? 'checked' : ''}> Show
                    </label>
                    <button class="icon-btn" onclick="removeProduct(${i})"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>
            <div class="field-row">
                <input class="field-input" data-prod-name="${i}" value="${esc(p.name)}" placeholder="Product name">
                <input class="field-input" style="max-width:5rem" data-prod-price="${i}" type="number" value="${p.price}" placeholder="Price">
            </div>
            <div class="field-row">
                <select class="field-input" data-prod-type="${i}">
                    <option value="digital" ${p.type === 'digital' ? 'selected' : ''}>Digital</option>
                    <option value="physical" ${p.type === 'physical' ? 'selected' : ''}>Physical</option>
                </select>
                <input class="field-input" data-prod-url="${i}" value="${esc(p.url || '')}" placeholder="Download / buy URL">
            </div>
            <textarea class="field-input" data-prod-desc="${i}" rows="2" placeholder="Description">${esc(p.description || '')}</textarea>
            <label class="upload-zone" style="padding:0.75rem;margin-bottom:0">
                <i class="fa-solid fa-image" style="font-size:1rem;margin-bottom:0.25rem"></i>
                <p style="font-size:0.6875rem">${p.image ? 'Change image' : 'Upload product image'}</p>
                <input type="file" accept="image/*" onchange="uploadProductImage(${i}, this)">
            </label>
            ${p.image ? `<img src="${p.image}" class="edit-thumb" alt="product">` : ''}
        </div>`;
}

function addCustomLink() {
    config.links.push({ id: uid(), title: 'New Link', subtitle: 'Tap to customize', url: 'https://', icon: 'fa-link', visible: true, group: 'custom' });
    renderEditLinks();
}

function removeLink(idx) {
    if (!confirm('Remove this link?')) return;
    config.links.splice(idx, 1);
    renderEditLinks();
}

function addSocial() {
    config.socials.push({ id: uid(), icon: 'fa-link', url: 'https://', label: 'New Social', shortLabel: 'New', visible: true });
    renderEditSocials();
}

function removeSocial(idx) { config.socials.splice(idx, 1); renderEditSocials(); }

function addProduct() {
    config.products.push({ id: uid(), name: 'New Product', price: 0, type: 'digital', url: '#', image: '', description: '', visible: true });
    renderEditProducts();
}

function removeProduct(idx) {
    if (!confirm('Remove this product?')) return;
    config.products.splice(idx, 1);
    renderEditProducts();
}

function addCastingRole() {
    config.casting.push({
        id: uid(), name: 'New Role', movie: 'Across the Stars', position: 'New Position',
        description: 'Describe this package.', price: 99, category: 'cast', requiresPhotos: true,
        type: 'casting', image: '', gallery: [], visible: true
    });
    renderEditCasting();
}

function removeCasting(idx) {
    if (!confirm('Remove this casting role?')) return;
    config.casting.splice(idx, 1);
    renderEditCasting();
}

function uploadAvatar(input) {
    readImageFile(input, data => {
        config.avatar = data;
        document.getElementById('avatar-img').src = data;
        showToast('Avatar updated');
    });
}

function uploadProductImage(idx, input) {
    readImageFile(input, data => {
        config.products[idx].image = data;
        renderEditProducts();
        showToast('Product image added');
    });
}

function uploadCastingImage(idx, type, input) {
    readImageFile(input, data => {
        if (type === 'cover') {
            config.casting[idx].image = data;
        } else {
            if (!config.casting[idx].gallery) config.casting[idx].gallery = [];
            config.casting[idx].gallery.push(data);
        }
        renderEditCasting();
        showToast(type === 'cover' ? 'Cover image added' : 'Gallery image added');
    });
}

function removeGalleryImage(castIdx, galleryIdx) {
    config.casting[castIdx].gallery.splice(galleryIdx, 1);
    renderEditCasting();
}

function readImageFile(input, callback) {
    const file = input.files[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
        showToast('Image too large — max 3MB');
        return;
    }
    const reader = new FileReader();
    reader.onload = e => callback(e.target.result);
    reader.readAsDataURL(file);
}

function saveStudio() {
    config.name = document.getElementById('edit-name').value.trim() || DEFAULT_CONFIG.name;
    config.tagline = document.getElementById('edit-tagline').value.trim() || DEFAULT_CONFIG.tagline;
    config.bio = document.getElementById('edit-bio').value.trim() || DEFAULT_CONFIG.bio;

    document.querySelectorAll('[data-link-vis]').forEach(cb => { config.links[parseInt(cb.dataset.linkVis)].visible = cb.checked; });
    document.querySelectorAll('[data-link-title]').forEach(inp => { config.links[parseInt(inp.dataset.linkTitle)].title = inp.value.trim(); });
    document.querySelectorAll('[data-link-sub]').forEach(inp => { config.links[parseInt(inp.dataset.linkSub)].subtitle = inp.value.trim(); });
    document.querySelectorAll('[data-link-url]').forEach(inp => { config.links[parseInt(inp.dataset.linkUrl)].url = inp.value.trim(); });

    document.querySelectorAll('[data-social-vis]').forEach(cb => { config.socials[parseInt(cb.dataset.socialVis)].visible = cb.checked; });
    document.querySelectorAll('[data-social-url]').forEach(inp => { config.socials[parseInt(inp.dataset.socialUrl)].url = inp.value.trim(); });
    document.querySelectorAll('[data-social-label]').forEach(inp => {
        const i = parseInt(inp.dataset.socialLabel);
        config.socials[i].shortLabel = inp.value.trim();
        if (!config.socials[i].shortLabel) config.socials[i].shortLabel = config.socials[i].label;
    });

    document.querySelectorAll('[data-prod-vis]').forEach(cb => { config.products[parseInt(cb.dataset.prodVis)].visible = cb.checked; });
    document.querySelectorAll('[data-prod-name]').forEach(inp => { config.products[parseInt(inp.dataset.prodName)].name = inp.value.trim(); });
    document.querySelectorAll('[data-prod-price]').forEach(inp => { config.products[parseInt(inp.dataset.prodPrice)].price = parseFloat(inp.value) || 0; });
    document.querySelectorAll('[data-prod-type]').forEach(sel => { config.products[parseInt(sel.dataset.prodType)].type = sel.value; });
    document.querySelectorAll('[data-prod-url]').forEach(inp => { config.products[parseInt(inp.dataset.prodUrl)].url = inp.value.trim(); });
    document.querySelectorAll('[data-prod-desc]').forEach(inp => { config.products[parseInt(inp.dataset.prodDesc)].description = inp.value.trim(); });

    document.querySelectorAll('[data-cast-vis]').forEach(cb => { config.casting[parseInt(cb.dataset.castVis)].visible = cb.checked; });
    document.querySelectorAll('[data-cast-name]').forEach(inp => { config.casting[parseInt(inp.dataset.castName)].name = inp.value.trim(); });
    document.querySelectorAll('[data-cast-movie]').forEach(inp => { config.casting[parseInt(inp.dataset.castMovie)].movie = inp.value.trim(); });
    document.querySelectorAll('[data-cast-position]').forEach(inp => { config.casting[parseInt(inp.dataset.castPosition)].position = inp.value.trim(); });
    document.querySelectorAll('[data-cast-desc]').forEach(inp => { config.casting[parseInt(inp.dataset.castDesc)].description = inp.value.trim(); });
    document.querySelectorAll('[data-cast-price]').forEach(inp => { config.casting[parseInt(inp.dataset.castPrice)].price = parseFloat(inp.value) || 0; });
    document.querySelectorAll('[data-cast-cat]').forEach(sel => { config.casting[parseInt(sel.dataset.castCat)].category = sel.value; });
    document.querySelectorAll('[data-cast-label]').forEach(inp => { config.casting[parseInt(inp.dataset.castLabel)].priceLabel = inp.value.trim() || null; });
    document.querySelectorAll('[data-cast-orig]').forEach(inp => { config.casting[parseInt(inp.dataset.castOrig)].originalPrice = parseFloat(inp.value) || null; });
    document.querySelectorAll('[data-cast-photos]').forEach(cb => { config.casting[parseInt(cb.dataset.castPhotos)].requiresPhotos = cb.checked; });
    document.querySelectorAll('[data-cast-promo]').forEach(cb => { config.casting[parseInt(cb.dataset.castPromo)].promoVideo = cb.checked; });

    saveConfig();
    render();
    toggleStudio();
    showToast('Your link page is live');
}

function resetDefaults() {
    if (!confirm('Reset everything to defaults? This cannot be undone.')) return;
    localStorage.removeItem(STORAGE_KEY);
    config = structuredClone(DEFAULT_CONFIG);
    artIndex = 0;
    setArtSlide(0);
    render();
    populateStudio();
    showToast('Defaults restored');
}

document.addEventListener('DOMContentLoaded', async () => {
    loadConfig();
    initParticles();
    initArtHero();
    await loadPaymentConfig();
    render();

    if (new URLSearchParams(location.search).get('cancelled')) {
        showToast('Checkout cancelled');
        history.replaceState({}, '', location.pathname);
    }
});