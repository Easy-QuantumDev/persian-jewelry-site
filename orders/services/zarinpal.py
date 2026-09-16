import requests

from django.conf import settings


# ==========================================
# ZARINPAL URLs
# ==========================================

if settings.ZARINPAL_SANDBOX:

    REQUEST_URL = (
        "https://sandbox.zarinpal.com/"
        "pg/v4/payment/request.json"
    )

    VERIFY_URL = (
        "https://sandbox.zarinpal.com/"
        "pg/v4/payment/verify.json"
    )

    STARTPAY_URL = (
        "https://sandbox.zarinpal.com/"
        "pg/StartPay/"
    )

else:

    REQUEST_URL = (
        "https://payment.zarinpal.com/"
        "pg/v4/payment/request.json"
    )

    VERIFY_URL = (
        "https://payment.zarinpal.com/"
        "pg/v4/payment/verify.json"
    )

    STARTPAY_URL = (
        "https://www.zarinpal.com/"
        "pg/StartPay/"
    )


# ==========================================
# CREATE PAYMENT
# ==========================================

def create_payment(order):

    # total_price در پروژه ما تومان است
    # زرین‌پال مبلغ را ریال می‌خواهد

    amount = int(order.total_price * 10)

    data = {
        "merchant_id": settings.ZARINPAL_MERCHANT_ID,

        "amount": amount,

        "description": (
            f"پرداخت سفارش {order.order_number}"
        ),

        "callback_url": (
            "http://127.0.0.1:8000/"
            "orders/payment/callback/"
        ),
    }

    try:

        response = requests.post(
            REQUEST_URL,
            json=data,
            timeout=15
        )

        response.raise_for_status()

        result = response.json()

    except requests.RequestException as e:

        return {
            "success": False,
            "error": str(e)
        }

    # --------------------------------------
    # SUCCESS
    # --------------------------------------

    if result.get("data", {}).get("code") == 100:

        authority = result["data"]["authority"]

        return {
            "success": True,
            "authority": authority,
            "payment_url": (
                STARTPAY_URL + authority
            )
        }

    # --------------------------------------
    # ERROR
    # --------------------------------------

    return {
        "success": False,
        "error": result
    }


# ==========================================
# VERIFY PAYMENT
# ==========================================

def verify_payment(order):

    amount = int(order.total_price * 10)

    data = {
        "merchant_id": settings.ZARINPAL_MERCHANT_ID,

        "amount": amount,

        "authority": order.authority,
    }

    try:

        response = requests.post(
            VERIFY_URL,
            json=data,
            timeout=15
        )

        response.raise_for_status()

        result = response.json()

    except requests.RequestException as e:

        return {
            "success": False,
            "error": str(e)
        }

    code = result.get("data", {}).get("code")

    # 100 = پرداخت موفق
    # 101 = تراکنش قبلاً verify شده

    if code in [100, 101]:

        return {
            "success": True,

            "ref_id": result["data"].get(
                "ref_id"
            ),

            "data": result["data"]
        }

    return {
        "success": False,
        "error": result
    }