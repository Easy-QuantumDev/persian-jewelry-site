
import uuid

import requests

from django.conf import settings
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.db import transaction
from django.shortcuts import redirect, render, get_object_or_404
from django.urls import reverse

from accounts.models import Profile
from cart.models import Cart
from products.models import Product

from .models import Order, OrderItem
from .sms import send_order_confirmation_sms


# =========================================================
# ساخت شماره سفارش
# =========================================================

def _generate_order_number():
    return f"ORD-{uuid.uuid4().hex[:10].upper()}"


# =========================================================
# تنظیمات زرین پال
# =========================================================

if settings.ZARINPAL_SANDBOX:

    ZARINPAL_REQUEST_URL = (
        "https://sandbox.zarinpal.com/pg/v4/payment/request.json"
    )

    ZARINPAL_VERIFY_URL = (
        "https://sandbox.zarinpal.com/pg/v4/payment/verify.json"
    )

    ZARINPAL_STARTPAY_URL = (
        "https://sandbox.zarinpal.com/pg/StartPay"
    )

else:

    ZARINPAL_REQUEST_URL = (
        "https://api.zarinpal.com/pg/v4/payment/request.json"
    )

    ZARINPAL_VERIFY_URL = (
        "https://api.zarinpal.com/pg/v4/payment/verify.json"
    )

    ZARINPAL_STARTPAY_URL = (
        "https://www.zarinpal.com/pg/StartPay"
    )


# =========================================================
# CHECKOUT
# =========================================================

@login_required
def checkout(request):

    profile, _ = Profile.objects.get_or_create(
        user=request.user
    )

    cart, _ = Cart.objects.get_or_create(
        user=request.user
    )

    items = cart.items.select_related(
        "product"
    ).all()

    # -----------------------------------------------------
    # سبد خالی
    # -----------------------------------------------------

    if not items.exists():

        messages.warning(
            request,
            "سبد خرید شما خالی است."
        )

        return redirect("cart:cart")

    # =====================================================
    # POST
    # =====================================================

    if request.method == "POST":

        first_name = request.POST.get(
            "first_name",
            ""
        ).strip()

        last_name = request.POST.get(
            "last_name",
            ""
        ).strip()

        phone = request.POST.get(
            "phone",
            ""
        ).strip()

        address = request.POST.get(
            "address",
            ""
        ).strip()

        city = request.POST.get(
            "city",
            ""
        ).strip()

        postal_code = request.POST.get(
            "postal_code",
            ""
        ).strip()

        errors = []

        # -------------------------------------------------
        # Validation
        # -------------------------------------------------

        if not first_name:
            errors.append(
                "لطفاً نام خود را وارد کنید."
            )

        if not last_name:
            errors.append(
                "لطفاً نام خانوادگی خود را وارد کنید."
            )

        if not phone:
            errors.append(
                "لطفاً شماره موبایل خود را وارد کنید."
            )

        if not city:
            errors.append(
                "لطفاً شهر را وارد کنید."
            )

        if not address:
            errors.append(
                "لطفاً آدرس کامل خود را وارد کنید."
            )

        # -------------------------------------------------
        # نمایش خطا
        # -------------------------------------------------

        if errors:

            return render(
                request,
                "checkout/checkout.html",
                {
                    "cart": cart,
                    "items": items,
                    "profile": profile,
                    "errors": errors,
                    "form_data": request.POST,
                }
            )

        # =================================================
        # بررسی موجودی
        # =================================================

        stock_error = False

        for item in items:

            if item.product.stock < item.quantity:

                errors.append(
                    f"موجودی محصول «{item.product.name}» "
                    f"کافی نیست. موجودی فعلی: "
                    f"{item.product.stock}"
                )

                stock_error = True

        if stock_error:

            return render(
                request,
                "checkout/checkout.html",
                {
                    "cart": cart,
                    "items": items,
                    "profile": profile,
                    "errors": errors,
                    "form_data": request.POST,
                }
            )

        # =================================================
        # ذخیره اطلاعات پروفایل
        # =================================================

        profile.phone = phone
        profile.address = address
        profile.city = city

        if postal_code:
            profile.postal_code = postal_code

        profile.save()

        # =================================================
        # ساخت سفارش
        # =================================================

        with transaction.atomic():

            order = Order.objects.create(

                user=request.user,

                order_number=_generate_order_number(),

                first_name=first_name,

                last_name=last_name,

                phone=phone,

                address=address,

                city=city,

                postal_code=postal_code,

                total_price=cart.total_price,

                status="pending",
            )

            # -------------------------------------------------
            # ساخت OrderItem
            # -------------------------------------------------

            for item in items:

                OrderItem.objects.create(

                    order=order,

                    product=item.product,

                    product_name=item.product.name,

                    price=item.product.price,

                    quantity=item.quantity,

                    total_price=item.total_price,
                )

            # -------------------------------------------------
            # خالی کردن سبد
            # -------------------------------------------------

            cart.items.all().delete()

        # =================================================
        # انتقال به پرداخت
        # =================================================

        return redirect(
            "orders:start_payment",
            order_number=order.order_number
        )

    # =====================================================
    # GET
    # =====================================================

    return render(
        request,
        "checkout/checkout.html",
        {
            "cart": cart,
            "items": items,
            "profile": profile,
            "form_data": {},
            "errors": [],
        }
    )


# =========================================================
# شروع پرداخت زرین پال
# =========================================================

@login_required
def start_payment(request, order_number):

    order = get_object_or_404(
        Order,
        order_number=order_number,
        user=request.user
    )

    # -----------------------------------------------------
    # سفارش قبلاً پرداخت شده
    # -----------------------------------------------------

    if order.status in [
        "paid",
        "processing",
        "shipped",
        "delivered",
    ]:

        return redirect(
            "orders:order_success",
            order_number=order.order_number
        )

    # -----------------------------------------------------
    # مبلغ
    # -----------------------------------------------------

    # قیمت‌ها در دیتابیس تومان هستند
    # زرین پال مبلغ را به ریال می‌خواهد

    amount = int(order.total_price * 10)

    if amount <= 0:

        messages.error(
            request,
            "مبلغ سفارش معتبر نیست."
        )

        return redirect(
            "orders:order_detail",
            order_number=order.order_number
        )

    # -----------------------------------------------------
    # Callback
    # -----------------------------------------------------

    callback_url = request.build_absolute_uri(
        reverse(
            "orders:verify_payment",
            kwargs={
                "order_number": order.order_number
            }
        )
    )

    # -----------------------------------------------------
    # اطلاعات درخواست
    # -----------------------------------------------------

    data = {
        "merchant_id": settings.ZARINPAL_MERCHANT_ID,

        "amount": amount,

        "callback_url": callback_url,

        "description": (
            f"پرداخت سفارش {order.order_number}"
        ),

        "metadata": {
            "mobile": order.phone,
            "email": request.user.email or "",
        },
    }

    # =====================================================
    # DEBUG
    # =====================================================

    print()
    print("=" * 70)
    print("ZARINPAL PAYMENT REQUEST")
    print("=" * 70)

    print("ORDER:", order.order_number)

    print(
        "TOTAL PRICE (TOMAN):",
        order.total_price
    )

    print(
        "AMOUNT (RIAL):",
        amount
    )

    print(
        "CALLBACK:",
        callback_url
    )

    print(
        "MERCHANT:",
        settings.ZARINPAL_MERCHANT_ID
    )

    print(
        "REQUEST URL:",
        ZARINPAL_REQUEST_URL
    )

    print("=" * 70)

    # =====================================================
    # درخواست به زرین پال
    # =====================================================

    try:

        response = requests.post(
            ZARINPAL_REQUEST_URL,
            json=data,
            timeout=30
        )

        # -------------------------------------------------
        # پاسخ خام
        # -------------------------------------------------

        print()
        print("=" * 70)
        print("ZARINPAL RAW RESPONSE")
        print("=" * 70)

        print(
            "HTTP STATUS:",
            response.status_code
        )

        print(
            "TEXT:"
        )

        print(
            response.text
        )

        print("=" * 70)

        response.raise_for_status()

        result = response.json()

    except requests.RequestException as e:

        print()
        print("=" * 70)
        print("ZARINPAL REQUEST ERROR")
        print("=" * 70)

        print(
            repr(e)
        )

        print("=" * 70)

        messages.error(
            request,
            "ارتباط با درگاه پرداخت برقرار نشد."
        )

        return redirect(
            "orders:order_detail",
            order_number=order.order_number
        )

    except ValueError as e:

        print()
        print("=" * 70)
        print("ZARINPAL JSON ERROR")
        print("=" * 70)

        print(
            repr(e)
        )

        print(
            "RAW RESPONSE:",
            response.text
        )

        print("=" * 70)

        messages.error(
            request,
            "پاسخ نامعتبر از درگاه پرداخت دریافت شد."
        )

        return redirect(
            "orders:order_detail",
            order_number=order.order_number
        )

    # =====================================================
    # پردازش پاسخ
    # =====================================================

    data_result = result.get(
        "data",
        {}
    )

    errors = result.get(
        "errors",
        []
    )

    code = data_result.get(
        "code"
    )

    authority = data_result.get(
        "authority"
    )

    print()
    print("=" * 70)
    print("ZARINPAL PARSED RESPONSE")
    print("=" * 70)

    print(
        "CODE:",
        code
    )

    print(
        "AUTHORITY:",
        authority
    )

    print(
        "ERRORS:",
        errors
    )

    print(
        "FULL RESULT:",
        result
    )

    print("=" * 70)

    # =====================================================
    # درخواست موفق
    # =====================================================

    if code == 100 and authority:

        order.authority = authority

        order.save(
            update_fields=[
                "authority",
                "updated_at",
            ]
        )

        # مهم:
        # ZARINPAL_STARTPAY_URL خودش انتهای authority ندارد
        # بنابراین اینجا authority را اضافه می‌کنیم.

        payment_url = (
            f"{ZARINPAL_STARTPAY_URL}/{authority}"
        )

        print()
        print("=" * 70)
        print("PAYMENT REQUEST SUCCESS")
        print("=" * 70)

        print(
            "AUTHORITY:",
            authority
        )

        print(
            "PAYMENT URL:",
            payment_url
        )

        print("=" * 70)

        return redirect(
            payment_url
        )

    # =====================================================
    # درخواست تکراری / قبلی
    # =====================================================

    if code == 101 and authority:

        order.authority = authority

        order.save(
            update_fields=[
                "authority",
                "updated_at",
            ]
        )

        payment_url = (
            f"{ZARINPAL_STARTPAY_URL}/{authority}"
        )

        print()
        print("=" * 70)
        print("PAYMENT REQUEST ALREADY EXISTS")
        print("=" * 70)

        print(
            "AUTHORITY:",
            authority
        )

        print(
            "PAYMENT URL:",
            payment_url
        )

        print("=" * 70)

        return redirect(
            payment_url
        )

    # =====================================================
    # خطا
    # =====================================================

    print()
    print("=" * 70)
    print("ZARINPAL PAYMENT FAILED")
    print("=" * 70)

    print(
        "RESULT:",
        result
    )

    print("=" * 70)

    messages.error(
        request,
        "درخواست پرداخت توسط زرین‌پال پذیرفته نشد."
    )

    return redirect(
        "orders:order_detail",
        order_number=order.order_number
    )


# =========================================================
# VERIFY PAYMENT
# =========================================================

def verify_payment(request, order_number):

    # -----------------------------------------------------
    # سفارش
    # -----------------------------------------------------

    order = get_object_or_404(
        Order,
        order_number=order_number
    )

    # -----------------------------------------------------
    # اطلاعات callback
    # -----------------------------------------------------

    authority = request.GET.get(
        "Authority"
    )

    status = request.GET.get(
        "Status"
    )

    print()
    print("=" * 70)
    print("ZARINPAL CALLBACK")
    print("=" * 70)

    print(
        "ORDER:",
        order.order_number
    )

    print(
        "STATUS:",
        status
    )

    print(
        "AUTHORITY:",
        authority
    )

    print("=" * 70)

    # -----------------------------------------------------
    # اگر کاربر پرداخت را لغو کرده
    # -----------------------------------------------------

    if status != "OK":

        order.status = "cancelled"

        order.save(
            update_fields=[
                "status",
                "updated_at",
            ]
        )

        messages.warning(
            request,
            "پرداخت سفارش لغو شد."
        )

        return redirect(
            "orders:order_detail",
            order_number=order.order_number
        )

    # -----------------------------------------------------
    # Authority وجود ندارد
    # -----------------------------------------------------

    if not authority:

        messages.error(
            request,
            "کد پرداخت از درگاه دریافت نشد."
        )

        return redirect(
            "orders:order_detail",
            order_number=order.order_number
        )

    # -----------------------------------------------------
    # اگر authority ذخیره شده بود
    # -----------------------------------------------------

    if order.authority and order.authority != authority:

        messages.error(
            request,
            "اطلاعات پرداخت معتبر نیست."
        )

        return redirect(
            "orders:order_detail",
            order_number=order.order_number
        )

    # =====================================================
    # اگر قبلاً پرداخت شده
    # =====================================================

    if order.status in [
        "paid",
        "processing",
        "shipped",
        "delivered",
    ]:

        return redirect(
            "orders:order_success",
            order_number=order.order_number
        )

    # =====================================================
    # مبلغ به ریال
    # =====================================================

    amount = int(
        order.total_price * 10
    )

    verify_data = {

        "merchant_id":
            settings.ZARINPAL_MERCHANT_ID,

        "amount":
            amount,

        "authority":
            authority,
    }

    # =====================================================
    # درخواست Verify
    # =====================================================

    print()
    print("=" * 70)
    print("ZARINPAL VERIFY REQUEST")
    print("=" * 70)

    print(
        "VERIFY URL:",
        ZARINPAL_VERIFY_URL
    )

    print(
        "AMOUNT:",
        amount
    )

    print(
        "AUTHORITY:",
        authority
    )

    print("=" * 70)

    try:

        response = requests.post(
            ZARINPAL_VERIFY_URL,
            json=verify_data,
            timeout=30
        )

        print()
        print("=" * 70)
        print("ZARINPAL VERIFY RAW RESPONSE")
        print("=" * 70)

        print(
            "HTTP STATUS:",
            response.status_code
        )

        print(
            response.text
        )

        print("=" * 70)

        response.raise_for_status()

        result = response.json()

    except requests.RequestException as e:

        print()
        print("=" * 70)
        print("ZARINPAL VERIFY ERROR")
        print("=" * 70)

        print(
            repr(e)
        )

        print("=" * 70)

        messages.error(
            request,
            "ارتباط با درگاه پرداخت برای تأیید تراکنش برقرار نشد."
        )

        return redirect(
            "orders:order_detail",
            order_number=order.order_number
        )

    except ValueError as e:

        print()
        print("=" * 70)
        print("ZARINPAL VERIFY JSON ERROR")
        print("=" * 70)

        print(
            repr(e)
        )

        print(
            "RAW:",
            response.text
        )

        print("=" * 70)

        messages.error(
            request,
            "پاسخ نامعتبر از درگاه پرداخت دریافت شد."
        )

        return redirect(
            "orders:order_detail",
            order_number=order.order_number
        )

    # =====================================================
    # نتیجه Verify
    # =====================================================

    data_result = result.get(
        "data",
        {}
    )

    errors = result.get(
        "errors",
        []
    )

    verify_code = data_result.get(
        "code"
    )

    ref_id = data_result.get(
        "ref_id"
    )

    print()
    print("=" * 70)
    print("ZARINPAL VERIFY RESULT")
    print("=" * 70)

    print(
        "CODE:",
        verify_code
    )

    print(
        "REF ID:",
        ref_id
    )

    print(
        "ERRORS:",
        errors
    )

    print(
        "FULL RESULT:",
        result
    )

    print("=" * 70)

    # =====================================================
    # پرداخت موفق
    # =====================================================

    if verify_code in [100, 101]:

        try:

            with transaction.atomic():

                # -----------------------------------------
                # قفل سفارش
                # -----------------------------------------

                locked_order = (
                    Order.objects
                    .select_for_update()
                    .get(
                        pk=order.pk
                    )
                )

                # -----------------------------------------
                # اگر قبلاً پردازش شده
                # -----------------------------------------

                if locked_order.status in [
                    "paid",
                    "processing",
                    "shipped",
                    "delivered",
                ]:

                    return redirect(
                        "orders:order_success",
                        order_number=locked_order.order_number
                    )

                # -----------------------------------------
                # دریافت آیتم‌های سفارش
                # -----------------------------------------

                order_items = list(
                    locked_order.items.all()
                )

                # -----------------------------------------
                # قفل محصولات
                # -----------------------------------------

                locked_products = {}

                for item in order_items:

                    product = (
                        Product.objects
                        .select_for_update()
                        .get(
                            pk=item.product_id
                        )
                    )

                    locked_products[
                        item.product_id
                    ] = product

                # -----------------------------------------
                # بررسی موجودی
                # -----------------------------------------

                insufficient_products = []

                for item in order_items:

                    product = locked_products[
                        item.product_id
                    ]

                    if product.stock < item.quantity:

                        insufficient_products.append(
                            f"{item.product_name} "
                            f"(موجودی: {product.stock})"
                        )

                # -----------------------------------------
                # موجودی کافی نیست
                # -----------------------------------------

                if insufficient_products:

                    print()
                    print("=" * 70)
                    print("STOCK PROBLEM AFTER PAYMENT")
                    print("=" * 70)

                    print(
                        insufficient_products
                    )

                    print("=" * 70)

                    # پرداخت تأیید شده ولی کالا موجود نیست.
                    # اینجا سفارش را paid نمی‌کنیم.
                    # برای حالت واقعی باید فرآیند refund داشته باشیم.

                    locked_order.status = "cancelled"

                    locked_order.ref_id = (
                        str(ref_id)
                        if ref_id
                        else None
                    )

                    locked_order.save(
                        update_fields=[
                            "status",
                            "ref_id",
                            "updated_at",
                        ]
                    )

                    messages.error(
                        request,
                        "پرداخت انجام شد اما موجودی یکی از "
                        "محصولات کافی نیست. لطفاً با پشتیبانی تماس بگیرید."
                    )

                    return redirect(
                        "orders:order_detail",
                        order_number=locked_order.order_number
                    )

                # -----------------------------------------
                # کم کردن موجودی
                # -----------------------------------------

                for item in order_items:

                    product = locked_products[
                        item.product_id
                    ]

                    product.stock -= item.quantity

                    product.save(
                        update_fields=[
                            "stock"
                        ]
                    )

                # -----------------------------------------
                # پرداخت موفق
                # -----------------------------------------

                locked_order.status = "paid"

                locked_order.ref_id = (
                    str(ref_id)
                    if ref_id
                    else None
                )

                locked_order.save(
                    update_fields=[
                        "status",
                        "ref_id",
                        "updated_at",
                    ]
                )

            # =================================================
            # ارسال SMS
            # =================================================

            try:

                if not locked_order.sms_sent:

                    send_order_confirmation_sms(
                        locked_order
                    )

                    locked_order.sms_sent = True

                    locked_order.save(
                        update_fields=[
                            "sms_sent",
                            "updated_at",
                        ]
                    )

            except Exception as sms_error:

                print()
                print("=" * 70)
                print("SMS ERROR")
                print("=" * 70)

                print(
                    repr(sms_error)
                )

                print("=" * 70)

            # =================================================
            # انتقال به صفحه موفقیت
            # =================================================

            return redirect(
                "orders:order_success",
                order_number=locked_order.order_number
            )

        except Exception as e:

            print()
            print("=" * 70)
            print("PAYMENT PROCESSING ERROR")
            print("=" * 70)

            print(
                repr(e)
            )

            print("=" * 70)

            messages.error(
                request,
                "پرداخت تأیید شد اما پردازش سفارش با مشکل مواجه شد."
            )

            return redirect(
                "orders:order_detail",
                order_number=order.order_number
            )

    # =====================================================
    # Verify ناموفق
    # =====================================================

    print()
    print("=" * 70)
    print("ZARINPAL VERIFY FAILED")
    print("=" * 70)

    print(
        "CODE:",
        verify_code
    )

    print(
        "ERRORS:",
        errors
    )

    print("=" * 70)

    messages.error(
        request,
        "پرداخت تأیید نشد."
    )

    return redirect(
        "orders:order_detail",
        order_number=order.order_number
    )


# =========================================================
# سفارش‌های من
# =========================================================

@login_required
def my_orders(request):

    orders = Order.objects.filter(
        user=request.user
    ).order_by(
        "-created_at"
    )

    return render(
        request,
        "orders/my-orders.html",
        {
            "orders": orders
        }
    )


# =========================================================
# جزئیات سفارش
# =========================================================

@login_required
def order_detail(
    request,
    order_number
):

    order = get_object_or_404(
        Order,
        order_number=order_number,
        user=request.user
    )

    items = order.items.select_related(
        "product"
    ).all()

    return render(
        request,
        "orders/order-detail.html",
        {
            "order": order,
            "items": items,
        }
    )


# =========================================================
# سفارش موفق
# =========================================================

@login_required
def order_success(
    request,
    order_number
):

    order = get_object_or_404(
        Order,
        order_number=order_number,
        user=request.user
    )

    # -----------------------------------------------------
    # فقط سفارش پرداخت‌شده می‌تواند این صفحه را ببیند
    # -----------------------------------------------------

    if order.status not in [
        "paid",
        "processing",
        "shipped",
        "delivered",
    ]:

        messages.warning(
            request,
            "این سفارش هنوز پرداخت نشده است."
        )

        return redirect(
            "orders:order_detail",
            order_number=order.order_number
        )

    items = order.items.select_related(
        "product"
    ).all()

    return render(
        request,
        "orders/order-success.html",
        {
            "order": order,
            "items": items,
        }
    )
