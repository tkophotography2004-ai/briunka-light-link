"""
Briunka Light Link-in-Bio — API Server
Stripe + PayPal checkout, email capture, casting orders.
"""
import json
import os
import uuid
from datetime import datetime, timezone
from pathlib import Path

from dotenv import load_dotenv
from flask import Flask, jsonify, request, send_from_directory
from werkzeug.utils import secure_filename

load_dotenv()

BASE_DIR = Path(__file__).parent
DATA_DIR = BASE_DIR / "data"
DATA_DIR.mkdir(exist_ok=True)

SUBSCRIBERS_FILE = DATA_DIR / "subscribers.json"
ORDERS_FILE = DATA_DIR / "orders.json"
CASTING_FILE = DATA_DIR / "casting-applications.json"
REVIEW_FILE = DATA_DIR / "review-submissions.json"
UPLOADS_DIR = DATA_DIR / "uploads"
UPLOADS_DIR.mkdir(exist_ok=True)

REVIEW_TIERS = {
    "standard": {"price": 5, "label": "Standard", "priority": 1},
    "skip": {"price": 10, "label": "Skip the Line", "priority": 2},
    "super_skip": {"price": 15, "label": "Super Skip", "priority": 3},
}

LIVE_ADMIN_PIN = os.getenv("LIVE_ADMIN_PIN", "lightworks")
ALLOWED_VIDEO_EXT = {".mp4", ".mov", ".webm", ".m4v", ".avi"}
MAX_VIDEO_BYTES = 50 * 1024 * 1024

SMTP_HOST = os.getenv("SMTP_HOST", "")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASS = os.getenv("SMTP_PASS", "")
NOTIFY_FROM = os.getenv("NOTIFY_FROM", "acrossthestars2026@gmail.com")
TWILIO_SID = os.getenv("TWILIO_ACCOUNT_SID", "")
TWILIO_TOKEN = os.getenv("TWILIO_AUTH_TOKEN", "")
TWILIO_FROM = os.getenv("TWILIO_PHONE_NUMBER", "")

NOTIFY_LOG = DATA_DIR / "notification-log.json"

def _is_real_key(val):
    if not val or len(val) < 8:
        return False
    placeholders = ("...", "your_", "xxx", "changeme", "placeholder")
    low = val.lower()
    return not any(p in low for p in placeholders)


STRIPE_SECRET = os.getenv("STRIPE_SECRET_KEY", "")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET", "")
PAYPAL_CLIENT_ID = os.getenv("PAYPAL_CLIENT_ID", "")
PAYPAL_CLIENT_SECRET = os.getenv("PAYPAL_CLIENT_SECRET", "")

STRIPE_READY = _is_real_key(STRIPE_SECRET)
PAYPAL_READY = _is_real_key(PAYPAL_CLIENT_ID) and _is_real_key(PAYPAL_CLIENT_SECRET)
PAYPAL_MODE = os.getenv("PAYPAL_MODE", "sandbox")
SITE_URL = os.getenv("SITE_URL", "http://localhost:8847")

app = Flask(__name__, static_folder=str(BASE_DIR), static_url_path="")


def _read_json(path, default=None):
    if default is None:
        default = []
    if not path.exists():
        return default
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    except (json.JSONDecodeError, OSError):
        return default


def _write_json(path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


def _now():
    return datetime.now(timezone.utc).isoformat()


@app.after_request
def cors(resp):
    resp.headers["Access-Control-Allow-Origin"] = "*"
    resp.headers["Access-Control-Allow-Headers"] = "Content-Type"
    resp.headers["Access-Control-Allow-Methods"] = "GET, POST, PATCH, OPTIONS"
    return resp


def _sort_queue(subs):
    pending = [s for s in subs if s.get("status") == "queued"]
    pending.sort(key=lambda s: (-REVIEW_TIERS.get(s.get("tier", "standard"), {}).get("priority", 0), s.get("queued_at", s.get("submitted_at", ""))))
    return pending


def _check_admin_pin():
    pin = request.headers.get("X-Live-Pin") or request.args.get("pin") or ""
    return pin == LIVE_ADMIN_PIN


@app.route("/")
def index():
    return send_from_directory(BASE_DIR, "index.html")


@app.route("/<path:path>")
def static_files(path):
    full = BASE_DIR / path
    if full.is_file():
        return send_from_directory(BASE_DIR, path)
    return send_from_directory(BASE_DIR, "index.html")


@app.route("/api/health")
def health():
    return jsonify({
        "ok": True,
        "stripe": STRIPE_READY,
        "paypal": PAYPAL_READY,
        "site_url": SITE_URL,
    })


@app.route("/api/config/public")
def public_config():
    return jsonify({
        "stripePublishableKey": os.getenv("STRIPE_PUBLISHABLE_KEY", ""),
        "paypalClientId": PAYPAL_CLIENT_ID,
        "paypalMode": PAYPAL_MODE,
        "paymentsEnabled": STRIPE_READY or PAYPAL_READY,
    })


@app.route("/api/subscribe", methods=["POST", "OPTIONS"])
def subscribe():
    if request.method == "OPTIONS":
        return "", 204

    body = request.get_json(silent=True) or {}
    email = (body.get("email") or "").strip().lower()
    name = (body.get("name") or "").strip()

    if not email or "@" not in email:
        return jsonify({"error": "Valid email required"}), 400

    subs = _read_json(SUBSCRIBERS_FILE, [])
    if any(s["email"] == email for s in subs):
        return jsonify({"ok": True, "message": "Already subscribed", "duplicate": True})

    subs.append({
        "id": str(uuid.uuid4()),
        "email": email,
        "name": name,
        "source": body.get("source", "bio-page"),
        "subscribed_at": _now(),
    })
    _write_json(SUBSCRIBERS_FILE, subs)
    return jsonify({"ok": True, "message": "Welcome to the LIGHT list"})


@app.route("/api/checkout/stripe", methods=["POST", "OPTIONS"])
def stripe_checkout():
    if request.method == "OPTIONS":
        return "", 204

    if not STRIPE_READY:
        return jsonify({"error": "Stripe not configured", "demo": True}), 503

    import stripe
    stripe.api_key = STRIPE_SECRET

    body = request.get_json(silent=True) or {}
    product = body.get("product", {})
    customer = body.get("customer", {})

    name = product.get("name", "Product")
    price = float(product.get("price", 0))
    product_id = product.get("id", "unknown")
    product_type = product.get("type", "digital")

    if price <= 0:
        return jsonify({"error": "Invalid price"}), 400

    metadata = {
        "product_id": product_id,
        "product_type": product_type,
        "customer_email": customer.get("email", ""),
        "customer_name": customer.get("name", ""),
    }

    if product_type == "casting":
        metadata["movie"] = product.get("movie", "")
        metadata["position"] = product.get("position", "")
    if product_type == "review":
        metadata["submission_id"] = product.get("submissionId", "")

    success_url = f"{SITE_URL}/success.html?session_id={{CHECKOUT_SESSION_ID}}&product={product_id}"
    if product_type == "review" and product.get("submissionId"):
        success_url = f"{SITE_URL}/success.html?type=review&submission={product['submissionId']}&product={product_id}"

    try:
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            mode="payment",
            customer_email=customer.get("email") or None,
            line_items=[{
                "price_data": {
                    "currency": "usd",
                    "unit_amount": int(price * 100),
                    "product_data": {
                        "name": name,
                        "description": product.get("description", "")[:500] or None,
                    },
                },
                "quantity": 1,
            }],
            metadata=metadata,
            success_url=success_url,
            cancel_url=f"{SITE_URL}/?cancelled=1#review-section",
        )
        return jsonify({"url": session.url, "sessionId": session.id})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/checkout/paypal/create", methods=["POST", "OPTIONS"])
def paypal_create():
    if request.method == "OPTIONS":
        return "", 204

    if not PAYPAL_READY:
        return jsonify({"error": "PayPal not configured", "demo": True}), 503

    import requests

    body = request.get_json(silent=True) or {}
    product = body.get("product", {})
    customer = body.get("customer", {})

    price = float(product.get("price", 0))
    name = product.get("name", "Product")

    if price <= 0:
        return jsonify({"error": "Invalid price"}), 400

    base = "https://api-m.sandbox.paypal.com" if PAYPAL_MODE == "sandbox" else "https://api-m.paypal.com"

    token_resp = requests.post(
        f"{base}/v1/oauth2/token",
        auth=(PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET),
        data={"grant_type": "client_credentials"},
        timeout=15,
    )
    token_resp.raise_for_status()
    token = token_resp.json()["access_token"]

    order_resp = requests.post(
        f"{base}/v2/checkout/orders",
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        },
        json={
            "intent": "CAPTURE",
            "purchase_units": [{
                "amount": {"currency_code": "USD", "value": f"{price:.2f}"},
                "description": name[:127],
                "custom_id": product.get("id", ""),
            }],
            "application_context": {
                "return_url": (
                    f"{SITE_URL}/success.html?type=review&submission={product['submissionId']}&provider=paypal&product={product.get('id', '')}"
                    if product.get("type") == "review" and product.get("submissionId")
                    else f"{SITE_URL}/success.html?provider=paypal&product={product.get('id', '')}"
                ),
                "cancel_url": f"{SITE_URL}/?cancelled=1",
                "brand_name": "Briunka Light",
                "shipping_preference": "NO_SHIPPING",
            },
        },
        timeout=15,
    )
    order_resp.raise_for_status()
    order = order_resp.json()

    orders = _read_json(ORDERS_FILE, [])
    orders.append({
        "id": order["id"],
        "provider": "paypal",
        "status": "created",
        "product": product,
        "customer": customer,
        "created_at": _now(),
    })
    _write_json(ORDERS_FILE, orders)

    approve = next((l["href"] for l in order.get("links", []) if l.get("rel") == "approve"), None)
    return jsonify({"orderId": order["id"], "approveUrl": approve})


@app.route("/api/checkout/paypal/capture", methods=["POST", "OPTIONS"])
def paypal_capture():
    if request.method == "OPTIONS":
        return "", 204

    if not PAYPAL_READY:
        return jsonify({"error": "PayPal not configured"}), 503

    import requests

    body = request.get_json(silent=True) or {}
    order_id = body.get("orderId")
    if not order_id:
        return jsonify({"error": "orderId required"}), 400

    base = "https://api-m.sandbox.paypal.com" if PAYPAL_MODE == "sandbox" else "https://api-m.paypal.com"

    token_resp = requests.post(
        f"{base}/v1/oauth2/token",
        auth=(PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET),
        data={"grant_type": "client_credentials"},
        timeout=15,
    )
    token = token_resp.json()["access_token"]

    cap_resp = requests.post(
        f"{base}/v2/checkout/orders/{order_id}/capture",
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
        json={},
        timeout=15,
    )
    cap_resp.raise_for_status()
    result = cap_resp.json()

    orders = _read_json(ORDERS_FILE, [])
    for o in orders:
        if o["id"] == order_id:
            o["status"] = "captured"
            o["captured_at"] = _now()
    _write_json(ORDERS_FILE, orders)

    return jsonify({"ok": True, "status": result.get("status")})


@app.route("/api/casting/apply", methods=["POST", "OPTIONS"])
def casting_apply():
    if request.method == "OPTIONS":
        return "", 204

    body = request.get_json(silent=True) or {}
    email = (body.get("email") or "").strip()
    name = (body.get("name") or "").strip()
    product = body.get("product", {})

    if not email or not name:
        return jsonify({"error": "Name and email required"}), 400

    apps = _read_json(CASTING_FILE, [])
    apps.append({
        "id": str(uuid.uuid4()),
        "email": email,
        "name": name,
        "phone": body.get("phone", ""),
        "instagram": body.get("instagram", ""),
        "notes": body.get("notes", ""),
        "reference_photo": body.get("referencePhoto", ""),
        "reference_photos": body.get("referencePhotos", []),
        "promo_video": product.get("promoVideo", False),
        "product_id": product.get("id"),
        "product_name": product.get("name"),
        "movie": product.get("movie"),
        "position": product.get("position"),
        "price": product.get("price"),
        "payment_provider": body.get("paymentProvider", "pending"),
        "payment_id": body.get("paymentId", ""),
        "status": "pending",
        "applied_at": _now(),
    })
    _write_json(CASTING_FILE, apps)

    subs = _read_json(SUBSCRIBERS_FILE, [])
    if not any(s["email"] == email.lower() for s in subs):
        subs.append({
            "id": str(uuid.uuid4()),
            "email": email.lower(),
            "name": name,
            "source": "casting-application",
            "subscribed_at": _now(),
        })
        _write_json(SUBSCRIBERS_FILE, subs)

    return jsonify({"ok": True, "message": "Application received"})


@app.route("/api/review/tiers")
def review_tiers():
    return jsonify(REVIEW_TIERS)


@app.route("/api/review/submit", methods=["POST", "OPTIONS"])
def review_submit():
    if request.method == "OPTIONS":
        return "", 204

    tier = (request.form.get("tier") or "standard").strip()
    if tier not in REVIEW_TIERS:
        return jsonify({"error": "Invalid tier"}), 400

    name = (request.form.get("name") or "").strip()
    email = (request.form.get("email") or "").strip().lower()
    artist = (request.form.get("artistName") or "").strip()
    title = (request.form.get("title") or "").strip()
    notes = (request.form.get("notes") or "").strip()
    phone = (request.form.get("phone") or "").strip()
    notify_email = request.form.get("notifyEmail", "true").lower() != "false"
    notify_sms = request.form.get("notifySms", "true").lower() != "false" and bool(phone)
    content_type = (request.form.get("contentType") or "link").strip()

    if not name or not email or "@" not in email:
        return jsonify({"error": "Name and valid email required"}), 400
    if not artist or not title:
        return jsonify({"error": "Artist name and content title required"}), 400

    content_url = (request.form.get("contentUrl") or "").strip()
    video_file = request.files.get("video")
    video_path = ""

    if content_type == "link":
        if not content_url:
            return jsonify({"error": "Video link required"}), 400
    elif content_type == "video":
        if not video_file or not video_file.filename:
            return jsonify({"error": "Video file required"}), 400
        ext = Path(video_file.filename).suffix.lower()
        if ext not in ALLOWED_VIDEO_EXT:
            return jsonify({"error": f"Video type not allowed. Use: {', '.join(ALLOWED_VIDEO_EXT)}"}), 400
        video_file.seek(0, 2)
        size = video_file.tell()
        video_file.seek(0)
        if size > MAX_VIDEO_BYTES:
            return jsonify({"error": "Video too large (max 50MB). Paste a link instead."}), 400
    else:
        return jsonify({"error": "Invalid content type"}), 400

    submission_id = str(uuid.uuid4())
    if content_type == "video":
        safe = secure_filename(video_file.filename) or "video.mp4"
        fname = f"{submission_id}_{safe}"
        dest = UPLOADS_DIR / fname
        video_file.save(dest)
        video_path = f"uploads/{fname}"

    subs = _read_json(REVIEW_FILE, [])
    entry = {
        "id": submission_id,
        "tier": tier,
        "tier_label": REVIEW_TIERS[tier]["label"],
        "priority": REVIEW_TIERS[tier]["priority"],
        "price": REVIEW_TIERS[tier]["price"],
        "name": name,
        "email": email,
        "phone": phone,
        "notify_email": notify_email,
        "notify_sms": notify_sms,
        "notified_up_next": False,
        "artist_name": artist,
        "title": title,
        "notes": notes,
        "content_type": content_type,
        "content_url": content_url if content_type == "link" else "",
        "video_path": video_path,
        "status": "pending_payment",
        "payment_provider": "",
        "submitted_at": _now(),
        "queued_at": None,
        "reviewed_at": None,
    }
    subs.append(entry)
    _write_json(REVIEW_FILE, subs)

    return jsonify({
        "ok": True,
        "submissionId": submission_id,
        "price": REVIEW_TIERS[tier]["price"],
        "tier": tier,
        "needsPayment": True,
    })


@app.route("/api/review/confirm/<submission_id>", methods=["POST", "OPTIONS"])
def review_confirm(submission_id):
    if request.method == "OPTIONS":
        return "", 204

    body = request.get_json(silent=True) or {}
    subs = _read_json(REVIEW_FILE, [])
    found = None
    for s in subs:
        if s["id"] == submission_id:
            found = s
            if s["status"] == "queued":
                return jsonify({"ok": True, "message": "Already in queue", "position": _queue_position(subs, s)})
            s["status"] = "queued"
            s["queued_at"] = _now()
            s["payment_provider"] = body.get("paymentProvider", "confirmed")
            break

    if not found:
        return jsonify({"error": "Submission not found"}), 404

    queue = _sort_queue(subs)
    pos = _queue_position(subs, found)
    total = len(queue)
    _notify_queued(found, pos, total)
    subs = _process_queue_notifications(subs)

    _write_json(REVIEW_FILE, subs)
    payload = _submission_status_payload(subs, found)
    msg = "You're UP NEXT! Join the live now." if pos == 1 else f"You're #{pos} in line — we'll notify you when you're up next!"
    return jsonify({
        "ok": True,
        "message": msg,
        **payload,
    })


def _queue_position(subs, entry):
    queue = _sort_queue(subs)
    for i, s in enumerate(queue):
        if s["id"] == entry["id"]:
            return i + 1
    return len(queue)


def _log_notification(entry_id, channel, recipient, subject, body):
    logs = _read_json(NOTIFY_LOG, [])
    logs.append({
        "id": str(uuid.uuid4()),
        "submission_id": entry_id,
        "channel": channel,
        "recipient": recipient,
        "subject": subject,
        "body": body,
        "sent_at": _now(),
    })
    _write_json(NOTIFY_LOG, logs[-200:])


def _send_email(to_addr, subject, body):
    if not SMTP_HOST or not SMTP_USER or not SMTP_PASS:
        _log_notification("", "email", to_addr, subject, body)
        return False
    import smtplib
    from email.mime.text import MIMEText
    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = NOTIFY_FROM
    msg["To"] = to_addr
    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=15) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASS)
            server.sendmail(NOTIFY_FROM, [to_addr], msg.as_string())
        return True
    except Exception as e:
        _log_notification("", "email_error", to_addr, subject, str(e))
        return False


def _send_sms(to_phone, body):
    if not TWILIO_SID or not TWILIO_TOKEN or not TWILIO_FROM:
        _log_notification("", "sms", to_phone, "", body)
        return False
    import requests
    phone = to_phone.strip()
    if not phone.startswith("+"):
        phone = "+1" + "".join(c for c in phone if c.isdigit())
    try:
        resp = requests.post(
            f"https://api.twilio.com/2010-04-01/Accounts/{TWILIO_SID}/Messages.json",
            auth=(TWILIO_SID, TWILIO_TOKEN),
            data={"From": TWILIO_FROM, "To": phone, "Body": body},
            timeout=15,
        )
        resp.raise_for_status()
        return True
    except Exception as e:
        _log_notification("", "sms_error", to_phone, "", str(e))
        return False


def _submission_status_payload(subs, entry):
    queue = _sort_queue(subs)
    pos = _queue_position(subs, entry)
    return {
        "submissionId": entry["id"],
        "status": entry.get("status"),
        "position": pos,
        "total_in_queue": len(queue),
        "artist_name": entry.get("artist_name"),
        "title": entry.get("title"),
        "tier": entry.get("tier_label"),
        "tier_label": entry.get("tier_label"),
        "price": entry.get("price"),
        "email": entry.get("email"),
        "up_next": pos == 1 and entry.get("status") == "queued",
    }


def _notify_queued(entry, position, total):
    if not entry.get("notify_email", True):
        return
    name = entry.get("name", "Creator")
    artist = entry.get("artist_name", "your submission")
    subject = f"Across the Stars Live Review — You're #{position} in line"
    body = (
        f"Hi {name},\n\n"
        f"Your submission \"{artist} — {entry.get('title', '')}\" is in the live review queue.\n\n"
        f"Position: #{position} of {total}\n"
        f"Tier: {entry.get('tier_label')} (${entry.get('price')})\n\n"
        f"We'll email and text you when you're UP NEXT!\n\n"
        f"— Briunka Light · Light Works Entertainment"
    )
    _send_email(entry["email"], subject, body)


def _notify_up_next(entry):
    if entry.get("notified_up_next"):
        return
    entry["notified_up_next"] = True
    entry["notified_up_next_at"] = _now()
    name = entry.get("name", "Creator")
    artist = entry.get("artist_name", "your submission")
    subject = "YOU'RE UP NEXT — Briunka Light Live Review!"
    body = (
        f"Hi {name},\n\n"
        f"You're UP NEXT in the live review queue!\n\n"
        f"\"{artist} — {entry.get('title', '')}\"\n\n"
        f"Join the live stream now — Briunka is about to review your submission!\n\n"
        f"— Briunka Light · #ACROSSTHESTARS"
    )
    sms = f"Briunka Light: You're UP NEXT in the live review queue! \"{artist}\" — join the live now!"
    if entry.get("notify_email", True):
        _send_email(entry["email"], subject, body)
    if entry.get("notify_sms") and entry.get("phone"):
        _send_sms(entry["phone"], sms)


def _process_queue_notifications(subs):
    queue = _sort_queue(subs)
    if queue:
        head = queue[0]
        if not head.get("notified_up_next"):
            _notify_up_next(head)
    return subs


@app.route("/api/review/queue")
def review_queue():
    if not _check_admin_pin():
        return jsonify({"error": "Invalid PIN"}), 403

    subs = _read_json(REVIEW_FILE, [])
    queue = _sort_queue(subs)
    reviewed = [s for s in subs if s.get("status") == "reviewed"][-20:]
    return jsonify({
        "queue": queue,
        "reviewed": list(reversed(reviewed)),
        "counts": {
            "queued": len(queue),
            "standard": len([s for s in queue if s.get("tier") == "standard"]),
            "skip": len([s for s in queue if s.get("tier") == "skip"]),
            "super_skip": len([s for s in queue if s.get("tier") == "super_skip"]),
        },
    })


@app.route("/api/review/submissions/<submission_id>/status", methods=["PATCH", "OPTIONS"])
def review_update_status(submission_id):
    if request.method == "OPTIONS":
        return "", 204
    if not _check_admin_pin():
        return jsonify({"error": "Invalid PIN"}), 403

    body = request.get_json(silent=True) or {}
    new_status = body.get("status", "reviewed")
    subs = _read_json(REVIEW_FILE, [])
    for s in subs:
        if s["id"] == submission_id:
            s["status"] = new_status
            if new_status == "reviewed":
                s["reviewed_at"] = _now()
            break
    else:
        return jsonify({"error": "Not found"}), 404

    subs = _process_queue_notifications(subs)
    _write_json(REVIEW_FILE, subs)
    return jsonify({"ok": True})


@app.route("/api/review/status", methods=["POST", "OPTIONS"])
def review_status():
    if request.method == "OPTIONS":
        return "", 204

    body = request.get_json(silent=True) or {}
    submission_id = (body.get("submissionId") or "").strip()
    email = (body.get("email") or "").strip().lower()

    subs = _read_json(REVIEW_FILE, [])
    entry = None

    if submission_id:
        entry = next((s for s in subs if s["id"] == submission_id), None)
    elif email:
        queued = [s for s in subs if s.get("email") == email and s.get("status") == "queued"]
        if queued:
            queue = _sort_queue(subs)
            for q in queue:
                if q.get("email") == email:
                    entry = q
                    break
            if not entry:
                entry = queued[-1]

    if not entry:
        return jsonify({"error": "No active submission found for this email"}), 404

    return jsonify(_submission_status_payload(subs, entry))


@app.route("/api/review/video/<submission_id>")
def review_video(submission_id):
    if not _check_admin_pin():
        return jsonify({"error": "Invalid PIN"}), 403

    subs = _read_json(REVIEW_FILE, [])
    entry = next((s for s in subs if s["id"] == submission_id), None)
    if not entry or not entry.get("video_path"):
        return jsonify({"error": "Video not found"}), 404

    return send_from_directory(DATA_DIR, entry["video_path"])


ENV_FILE = BASE_DIR / ".env"

ENV_KEYS = {
    "stripePublishableKey": "STRIPE_PUBLISHABLE_KEY",
    "stripeSecretKey": "STRIPE_SECRET_KEY",
    "stripeWebhookSecret": "STRIPE_WEBHOOK_SECRET",
    "paypalClientId": "PAYPAL_CLIENT_ID",
    "paypalClientSecret": "PAYPAL_CLIENT_SECRET",
    "paypalMode": "PAYPAL_MODE",
    "siteUrl": "SITE_URL",
}


def _read_env_file():
    if not ENV_FILE.exists():
        return {}
    result = {}
    for line in ENV_FILE.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, _, v = line.partition("=")
        result[k.strip()] = v.strip()
    return result


def _write_env_file(updates):
    existing = _read_env_file()
    for js_key, val in updates.items():
        if val:
            existing[ENV_KEYS[js_key]] = val
    lines = []
    if ENV_FILE.exists():
        for line in ENV_FILE.read_text(encoding="utf-8").splitlines():
            stripped = line.strip()
            if stripped and not stripped.startswith("#") and "=" in stripped:
                k = stripped.partition("=")[0].strip()
                if k in existing:
                    lines.append(f"{k}={existing.pop(k)}")
                    continue
            lines.append(line)
    for k, v in existing.items():
        lines.append(f"{k}={v}")
    ENV_FILE.write_text("\n".join(lines) + "\n", encoding="utf-8")


@app.route("/api/admin/save-keys", methods=["POST", "OPTIONS"])
def save_keys():
    if request.method == "OPTIONS":
        return "", 204

    body = request.get_json(silent=True) or {}
    updates = {k: (body.get(k) or "").strip() for k in ENV_KEYS}
    updates = {k: v for k, v in updates.items() if v}

    if not updates:
        return jsonify({"error": "No keys provided"}), 400

    try:
        _write_env_file(updates)
        load_dotenv(override=True)
        global STRIPE_SECRET, STRIPE_WEBHOOK_SECRET, PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET
        global STRIPE_READY, PAYPAL_READY, PAYPAL_MODE, SITE_URL
        STRIPE_SECRET = os.getenv("STRIPE_SECRET_KEY", "")
        STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET", "")
        PAYPAL_CLIENT_ID = os.getenv("PAYPAL_CLIENT_ID", "")
        PAYPAL_CLIENT_SECRET = os.getenv("PAYPAL_CLIENT_SECRET", "")
        PAYPAL_MODE = os.getenv("PAYPAL_MODE", "sandbox")
        SITE_URL = os.getenv("SITE_URL", "http://localhost:8847")
        STRIPE_READY = _is_real_key(STRIPE_SECRET)
        PAYPAL_READY = _is_real_key(PAYPAL_CLIENT_ID) and _is_real_key(PAYPAL_CLIENT_SECRET)
        return jsonify({
            "ok": True,
            "stripe": STRIPE_READY,
            "paypal": PAYPAL_READY,
            "restartRecommended": True,
        })
    except OSError as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/webhook/stripe", methods=["POST"])
def stripe_webhook():
    if not STRIPE_SECRET or not STRIPE_WEBHOOK_SECRET:
        return jsonify({"error": "not configured"}), 503

    import stripe
    stripe.api_key = STRIPE_SECRET

    payload = request.data
    sig = request.headers.get("Stripe-Signature", "")

    try:
        event = stripe.Webhook.construct_event(payload, sig, STRIPE_WEBHOOK_SECRET)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        orders = _read_json(ORDERS_FILE, [])
        orders.append({
            "id": session["id"],
            "provider": "stripe",
            "status": "completed",
            "metadata": session.get("metadata", {}),
            "amount": session.get("amount_total"),
            "customer_email": session.get("customer_details", {}).get("email"),
            "completed_at": _now(),
        })
        _write_json(ORDERS_FILE, orders)

    return jsonify({"received": True})


if __name__ == "__main__":
    port = int(os.getenv("PORT", 8847))
    print(f"\n  BRIUNKA LIGHT — http://localhost:{port}")
    print(f"  Stripe: {'ON' if STRIPE_READY else 'OFF (add keys to .env)'}")
    print(f"  PayPal: {'ON' if PAYPAL_READY else 'OFF (add keys to .env)'}\n")
    app.run(host="0.0.0.0", port=port, debug=False)