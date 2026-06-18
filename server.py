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

load_dotenv()

BASE_DIR = Path(__file__).parent
DATA_DIR = BASE_DIR / "data"
DATA_DIR.mkdir(exist_ok=True)

SUBSCRIBERS_FILE = DATA_DIR / "subscribers.json"
ORDERS_FILE = DATA_DIR / "orders.json"
CASTING_FILE = DATA_DIR / "casting-applications.json"

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
    resp.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    return resp


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
            success_url=f"{SITE_URL}/success.html?session_id={{CHECKOUT_SESSION_ID}}&product={product_id}",
            cancel_url=f"{SITE_URL}/?cancelled=1",
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
                "return_url": f"{SITE_URL}/success.html?provider=paypal&product={product.get('id', '')}",
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

    if not PAYPAL_CLIENT_ID or not PAYPAL_CLIENT_SECRET:
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