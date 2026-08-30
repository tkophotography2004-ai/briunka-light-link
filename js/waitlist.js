(function () {
    const form = document.getElementById('waitlist-form');
    if (!form) return;
    const err = document.getElementById('wl-err');
    const ok = document.getElementById('wl-ok');
    const go = document.getElementById('wl-go');
    const NOTIFY = 'acrossthestars2026@gmail.com';

    function slugUser(name, email) {
        const fromName = String(name || '').toLowerCase().replace(/[^a-z0-9_]+/g, '_').replace(/^_|_$/g, '');
        const fromEmail = String(email || '').split('@')[0].toLowerCase().replace(/[^a-z0-9_]+/g, '');
        const raw = (fromName || fromEmail || 'creator').slice(0, 20);
        return raw.length >= 3 ? raw : (raw + 'house').slice(0, 20);
    }

    function markDone(msg) {
        ok.textContent = msg;
        ok.hidden = false;
        err.hidden = true;
        form.querySelectorAll('input, button').forEach(el => { if (el !== go) el.disabled = true; });
        go.disabled = true;
        go.textContent = 'Submitted';
    }

    function markFail(msg) {
        err.textContent = msg;
        err.hidden = false;
        go.disabled = false;
        go.textContent = 'Join and sign';
    }

    async function postJson(url, body) {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify(body)
        });
        const json = await res.json().catch(() => ({}));
        return { ok: res.ok, json };
    }

    function looksLikeActivation(json) {
        const text = [json && json.error, json && json.message, json && json.success]
            .filter(Boolean).join(' ');
        return /activat/i.test(String(text));
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        err.hidden = true;
        ok.hidden = true;
        const data = new FormData(form);
        if (data.get('ndaAgree') !== 'on') {
            markFail('Check the NDA box on this form.');
            return;
        }
        go.disabled = true;
        go.textContent = 'Submitting…';

        const name = String(data.get('name') || '').trim();
        const email = String(data.get('email') || '').trim();
        let username = String(data.get('username') || '').trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
        if (username.length < 3) username = slugUser(name, email);
        let work = String(data.get('workLink') || '').trim();
        if (work && !/^https?:\/\//i.test(work)) work = 'https://' + work;

        const payload = {
            displayName: name,
            name,
            username,
            email,
            social: String(data.get('social') || '').trim(),
            workLink: work,
            ndaName: String(data.get('ndaName') || '').trim(),
            ndaAgree: true,
            source: form.getAttribute('data-source') || 'waitlist'
        };

        try {
            localStorage.setItem('ecosystem-waitlist', JSON.stringify({ ...payload, at: new Date().toISOString() }));
        } catch { /* ignore */ }

        try {
            const local = await postJson('/api/waitlist', payload);
            if (local.ok && local.json.ok === true) {
                markDone(local.json.message || 'You are on the waitlist and the NDA is signed.');
                return;
            }
        } catch { /* GitHub Pages has no API — email the inbox next */ }

        try {
            const mailed = await postJson('https://formsubmit.co/ajax/' + NOTIFY, {
                ...payload,
                _subject: 'Light Works waitlist + NDA',
                _template: 'table',
                _captcha: 'false',
                _honey: '',
                _replyto: email
            });
            if (looksLikeActivation(mailed.json)) {
                markFail('Check ' + NOTIFY + ' (inbox and spam) for “Activate form”, open it in Chrome or Safari — not the Gmail app — then submit again. After that, applications land in that inbox.');
                return;
            }
            const success = mailed.json.success === true || mailed.json.success === 'true';
            if (mailed.ok && success) {
                markDone('Application sent to ' + NOTIFY + '. We will review it and send the house after approval.');
                return;
            }
        } catch { /* ignore */ }

        markFail('Could not reach the waitlist server, so the application was not emailed. Use the live bio link (not a downloaded file) and try again.');
    });
})();
