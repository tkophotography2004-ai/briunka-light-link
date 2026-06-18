let paymentConfig = { stripePublishableKey: '', paypalClientId: '', paypalMode: 'sandbox', paymentsEnabled: false };

async function loadPaymentConfig() {
    try {
        const res = await fetch('/api/config/public');
        if (res.ok) paymentConfig = await res.json();
    } catch { /* demo mode */ }
}

async function subscribeEmail(email, name, source = 'bio-page') {
    const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, source })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Subscribe failed');
    return data;
}

async function submitCastingApplication(payload) {
    const res = await fetch('/api/casting/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Application failed');
    return data;
}

async function payWithStripe(product, customer) {
    const res = await fetch('/api/checkout/stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product, customer })
    });
    const data = await res.json();
    if (!res.ok) {
        if (data.demo) return { demo: true };
        throw new Error(data.error || 'Stripe checkout failed');
    }
    window.location.href = data.url;
    return data;
}

async function payWithPayPal(product, customer) {
    const res = await fetch('/api/checkout/paypal/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product, customer })
    });
    const data = await res.json();
    if (!res.ok) {
        if (data.demo) return { demo: true };
        throw new Error(data.error || 'PayPal checkout failed');
    }
    if (data.approveUrl) window.location.href = data.approveUrl;
    return data;
}

async function processCheckout(product, customer, provider) {
    if (product.type === 'casting') {
        await submitCastingApplication({
            email: customer.email,
            name: customer.name,
            phone: customer.phone || '',
            instagram: customer.instagram || '',
            notes: customer.notes || '',
            referencePhoto: customer.referencePhoto || '',
            product,
            paymentProvider: provider
        });
    }

    if (provider === 'stripe') return payWithStripe(product, customer);
    if (provider === 'paypal') return payWithPayPal(product, customer);
}