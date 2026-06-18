let livePin = localStorage.getItem('liveReviewPin') || '';

async function unlockDashboard() {
    livePin = document.getElementById('pin-input').value.trim();
    if (!livePin) return;
    const ok = await loadQueue(true);
    if (ok) {
        localStorage.setItem('liveReviewPin', livePin);
        document.getElementById('pin-gate').classList.add('hidden');
        document.getElementById('dashboard').classList.remove('hidden');
        setInterval(loadQueue, 15000);
    } else {
        alert('Invalid PIN');
    }
}

async function loadQueue(isUnlock) {
    try {
        const res = await fetch('/api/review/queue?pin=' + encodeURIComponent(livePin), {
            headers: { 'X-Live-Pin': livePin }
        });
        if (!res.ok) return false;
        const data = await res.json();
        if (!isUnlock) renderDashboard(data);
        else {
            renderDashboard(data);
            return true;
        }
    } catch { return false; }
}

function renderDashboard(data) {
    const c = data.counts || {};
    document.getElementById('dash-stats').innerHTML = `
        <div class="stat-pill"><div class="stat-num">${c.queued || 0}</div><div class="stat-lbl">In Queue</div></div>
        <div class="stat-pill"><div class="stat-num">${c.super_skip || 0}</div><div class="stat-lbl">Super Skip</div></div>
        <div class="stat-pill"><div class="stat-num">${c.skip || 0}</div><div class="stat-lbl">Skip</div></div>
        <div class="stat-pill"><div class="stat-num">${c.standard || 0}</div><div class="stat-lbl">Standard</div></div>`;

    document.getElementById('queue-count').textContent = `(${c.queued || 0})`;

    const queue = data.queue || [];
    const nowEl = document.getElementById('queue-now');
    if (queue.length) {
        nowEl.innerHTML = buildQueueItem(queue[0], true);
    } else {
        nowEl.innerHTML = '<div class="empty-queue"><i class="fa-solid fa-mug-hot"></i><br>No submissions yet — share your bio link!</div>';
    }

    document.getElementById('queue-list').innerHTML = queue.length > 1
        ? queue.slice(1).map(s => buildQueueItem(s)).join('')
        : '<div class="empty-queue">Queue is clear after the current submission.</div>';

    const reviewed = data.reviewed || [];
    document.getElementById('reviewed-list').innerHTML = reviewed.length
        ? reviewed.map(s => buildQueueItem(s, false, true)).join('')
        : '<div class="empty-queue">No reviewed submissions yet.</div>';
}

function buildQueueItem(s, isNow, isReviewed) {
    const tierCls = s.tier === 'super_skip' ? 'super' : '';
    const content = s.content_type === 'link'
        ? `<a href="${s.content_url}" target="_blank" class="queue-btn play"><i class="fa-solid fa-external-link"></i> Open Link</a>`
        : `<a href="/api/review/video/${s.id}?pin=${encodeURIComponent(livePin)}" target="_blank" class="queue-btn play"><i class="fa-solid fa-play"></i> Play Video</a>`;

    const actions = isReviewed ? '' : `
        <div class="queue-btns">
            ${content}
            <button class="queue-btn done" onclick="markReviewed('${s.id}')"><i class="fa-solid fa-check"></i> Done</button>
        </div>`;

    return `
        <div class="queue-item tier-${s.tier}${isNow ? ' queue-now-item' : ''}">
            <div class="queue-item-header">
                <div>
                    <div class="queue-artist">${esc(s.artist_name)}</div>
                    <div class="queue-title">${esc(s.title)}</div>
                </div>
                <span class="tier-chip ${tierCls}">${esc(s.tier_label)} · $${s.price}</span>
            </div>
            <div class="queue-meta">
                ${esc(s.name)} · ${esc(s.email)}
                ${s.notes ? '<br>Note: ' + esc(s.notes) : ''}
            </div>
            ${actions}
        </div>`;
}

function esc(str) {
    const d = document.createElement('div');
    d.textContent = str || '';
    return d.innerHTML;
}

async function markReviewed(id) {
    await fetch(`/api/review/submissions/${id}/status?pin=${encodeURIComponent(livePin)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'X-Live-Pin': livePin },
        body: JSON.stringify({ status: 'reviewed' })
    });
    loadQueue();
}

document.addEventListener('DOMContentLoaded', () => {
    if (livePin) {
        document.getElementById('pin-input').value = livePin;
        unlockDashboard();
    }
    document.getElementById('pin-input')?.addEventListener('keydown', e => {
        if (e.key === 'Enter') unlockDashboard();
    });
});