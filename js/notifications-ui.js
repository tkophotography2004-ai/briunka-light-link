const ACTIVE_REVIEW_KEY = 'activeReviewSubmission';
let positionPollTimer = null;

function saveActiveReview(submissionId, email) {
    localStorage.setItem(ACTIVE_REVIEW_KEY, JSON.stringify({ submissionId, email, savedAt: Date.now() }));
    startPositionPolling();
}

function loadActiveReview() {
    try {
        return JSON.parse(localStorage.getItem(ACTIVE_REVIEW_KEY));
    } catch { return null; }
}

function clearActiveReview() {
    localStorage.removeItem(ACTIVE_REVIEW_KEY);
    stopPositionPolling();
    const card = document.getElementById('queue-status-card');
    if (card) card.style.display = 'none';
}

async function fetchQueueStatus(submissionId, email) {
    const res = await fetch('/api/review/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionId, email })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Not found');
    return data;
}

function renderQueueStatusCard(data) {
    const card = document.getElementById('queue-status-card');
    if (!card) return;

    if (data.status === 'reviewed') {
        card.innerHTML = `
            <div class="queue-status-inner reviewed">
                <i class="fa-solid fa-check-circle"></i>
                <div>
                    <strong>${esc(data.artist_name)} — ${esc(data.title)}</strong>
                    <p>Reviewed! Thanks for submitting.</p>
                </div>
                <button class="queue-status-dismiss" onclick="clearActiveReview()">×</button>
            </div>`;
        card.style.display = 'block';
        stopPositionPolling();
        return;
    }

    if (data.status !== 'queued') {
        card.style.display = 'none';
        return;
    }

    const pos = data.position;
    const total = data.total_in_queue;
    let statusMsg = `You're <strong>#${pos}</strong> of ${total} in line`;
    let statusClass = 'waiting';

    if (pos === 1) {
        statusMsg = '<strong>You\'re UP NEXT!</strong> Join the live now';
        statusClass = 'up-next';
    } else if (pos === 2) {
        statusMsg = "<strong>You're next after this one!</strong> Get ready";
        statusClass = 'almost';
    }

    card.innerHTML = `
        <div class="queue-status-inner ${statusClass}">
            <div class="queue-position-badge">${pos}</div>
            <div class="queue-status-text">
                <div class="queue-status-title">${esc(data.artist_name)} — ${esc(data.title)}</div>
                <p class="queue-status-msg">${statusMsg}</p>
                <p class="queue-status-tier">${esc(data.tier_label)} · $${data.price}</p>
            </div>
            <button class="queue-status-dismiss" onclick="clearActiveReview()" title="Dismiss">×</button>
        </div>`;
    card.style.display = 'block';
}

async function pollQueuePosition() {
    const active = loadActiveReview();
    if (!active) return;
    try {
        const data = await fetchQueueStatus(active.submissionId, active.email);
        renderQueueStatusCard(data);
        if (data.status === 'reviewed') clearActiveReview();
    } catch { /* submission expired */ }
}

function startPositionPolling() {
    stopPositionPolling();
    pollQueuePosition();
    positionPollTimer = setInterval(pollQueuePosition, 20000);
}

function stopPositionPolling() {
    if (positionPollTimer) clearInterval(positionPollTimer);
    positionPollTimer = null;
}

async function checkQueueByEmail(e) {
    e.preventDefault();
    const email = document.getElementById('check-queue-email').value.trim();
    if (!email) return showToast('Enter your email');

    try {
        const data = await fetchQueueStatus(null, email);
        if (data.submissionId) {
            saveActiveReview(data.submissionId, email);
        }
        renderQueueStatusCard(data);
        showToast(data.status === 'queued' ? `You're #${data.position} in line` : 'Status updated');
    } catch (err) {
        showToast(err.message || 'No active submission found');
    }
}

function showSubmissionSuccess(data, submissionId, email) {
    saveActiveReview(submissionId, email);
    renderQueueStatusCard({
        status: 'queued',
        position: data.position,
        total_in_queue: data.total_in_queue || data.position,
        artist_name: data.artist_name || '',
        title: data.title || 'Your submission',
        tier_label: data.tier || data.tier_label || '',
        price: data.price || ''
    });
    const msg = data.position === 1
        ? `You're UP NEXT in the queue!`
        : `You're #${data.position} in line — we'll notify you when you're up next`;
    showToast(msg);
}

document.addEventListener('DOMContentLoaded', () => {
    if (loadActiveReview()) startPositionPolling();
    document.getElementById('check-queue-form')?.addEventListener('submit', checkQueueByEmail);
});