import requests

from django.conf import settings


def send_order_confirmation_sms(order):

    url = "https://rest.payamak-panel.com/api/SendSMS/SendSMS"

    message = (
        f"فروشگاه جواهرات\n"
        f"سفارش شما با موفقیت ثبت شد.\n"
        f"شماره سفارش: {order.order_number}\n"
        f"مبلغ: {int(order.total_price):,} تومان\n"
        f"کد رهگیری: {order.ref_id}"
    )

    payload = {
        "username": settings.MELIPAYAMAK_TOKEN,
        "password": settings.MELIPAYAMAK_TOKEN,
        "to": order.phone,
        "from": settings.MELIPAYAMAK_SENDER_NUMBER,
        "text": message,
    }

    response = requests.post(
        url,
        data=payload,
        timeout=15
    )

    response.raise_for_status()

    return response