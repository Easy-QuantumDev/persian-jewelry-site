import requests

from django.conf import settings


MELIPAYAMAK_URL = "https://rest.payamak-panel.com/api/SendSMS/SendSMS"


def send_sms(phone, text):
    """
    ارسال پیامک عمومی
    """

    payload = {
        "username": settings.MELIPAYAMAK_USERNAME,
        "password": settings.MELIPAYAMAK_PASSWORD,
        "to": phone,
        "from": settings.MELIPAYAMAK_SENDER_NUMBER,
        "text": text,
    }

    try:
        response = requests.post(
            MELIPAYAMAK_URL,
            data=payload,
            timeout=15
        )

        print("MELIPAYAMAK STATUS:", response.status_code)
        print("MELIPAYAMAK RESPONSE:", response.text)

        response.raise_for_status()

        return True

    except requests.RequestException as e:

        print("MELIPAYAMAK ERROR:", repr(e))

        return False


def send_otp_sms(phone, code):
    """
    پیامک ثبت نام
    """

    message = (
        "فروشگاه جواهرات\n"
        f"کد تایید شما: {code}\n"
        "این کد ۲ دقیقه اعتبار دارد."
    )

    return send_sms(phone, message)


def send_login_otp_sms(phone, code):
    """
    پیامک ورود با کد یکبار مصرف
    """

    message = (
        "فروشگاه جواهرات\n"
        f"کد ورود شما: {code}\n"
        "این کد ۲ دقیقه اعتبار دارد."
    )

    return send_sms(phone, message)


def send_password_reset_otp_sms(phone, code):
    """
    پیامک بازیابی رمز عبور
    """

    message = (
        "فروشگاه جواهرات\n"
        f"کد بازیابی رمز عبور شما: {code}\n"
        "این کد ۲ دقیقه اعتبار دارد."
    )

    return send_sms(phone, message)


def send_order_confirmation_sms(order):
    """
    پیامک بعد از پرداخت موفق
    """

    message = (
        "فروشگاه جواهرات\n"
        "پرداخت سفارش شما با موفقیت انجام شد.\n"
        f"شماره سفارش: {order.order_number}\n"
        f"مبلغ: {int(order.total_price):,} تومان\n"
        f"کد رهگیری: {order.ref_id or '-'}"
    )

    return send_sms(
        order.phone,
        message
    )


def send_order_shipped_sms(order, tracking_code=None):
    """
    پیامک ارسال سفارش
    """

    message = (
        "فروشگاه جواهرات\n"
        f"سفارش {order.order_number} ارسال شد.\n"
    )

    if tracking_code:
        message += f"کد مرسوله: {tracking_code}"

    return send_sms(
        order.phone,
        message
    )