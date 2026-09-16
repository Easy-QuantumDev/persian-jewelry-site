import secrets
import re

from datetime import timedelta

from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth.hashers import make_password
from django.db import transaction
from django.http import JsonResponse
from django.urls import reverse
from django.utils import timezone
from django.views.decorators.http import require_POST

from .models import Profile
from .sms import send_otp_sms


def _is_ajax(request):
    return request.headers.get(
        "x-requested-with"
    ) == "XMLHttpRequest"


# =========================================================
# LOGIN
# =========================================================

def loggin(request):

    if request.user.is_authenticated:
        return redirect("pages:home")

    if request.method == "POST":

        identifier = request.POST.get(
            "identifier",
            ""
        ).strip()

        password = request.POST.get(
            "password",
            ""
        )

        if not identifier or not password:

            messages.error(
                request,
                "شماره موبایل/ایمیل و رمز عبور را وارد کنید."
            )

            return render(
                request,
                "signup-signin/login.html"
            )

        user = None

        # -------------------------------------------------
        # اول بررسی شماره موبایل
        # -------------------------------------------------

        if re.match(r"^09\d{9}$", identifier):

            try:

                profile = Profile.objects.select_related(
                    "user"
                ).get(
                    phone=identifier
                )

                user = profile.user

            except Profile.DoesNotExist:

                user = None

        # -------------------------------------------------
        # اگر شماره پیدا نشد، ایمیل را بررسی کن
        # برای کاربران قدیمی
        # -------------------------------------------------

        else:

            try:

                user = User.objects.get(
                    email__iexact=identifier
                )

            except User.DoesNotExist:

                user = None

        # -------------------------------------------------
        # احراز هویت
        # -------------------------------------------------

        if user is not None:

            authenticated_user = authenticate(
                request,
                username=user.username,
                password=password
            )

            if authenticated_user is not None:

                login(
                    request,
                    authenticated_user
                )

                return redirect(
                    "pages:home"
                )

        messages.error(
            request,
            "شماره موبایل/ایمیل یا رمز عبور اشتباه است."
        )

    return render(
        request,
        "signup-signin/login.html"
    )


# =========================================================
# CHECK EMAIL
# =========================================================

def check_email(request):

    email = request.GET.get(
        "email",
        ""
    ).strip()

    # ایمیل اختیاری است
    if not email:

        return JsonResponse({
            "available": True,
            "error": None
        })

    taken = User.objects.filter(
        email__iexact=email
    ).exists()

    return JsonResponse({
        "available": not taken,
        "error": (
            None
            if not taken
            else "این ایمیل قبلاً ثبت شده است."
        ),
    })


# =========================================================
# SEND SIGNUP OTP
# =========================================================

@require_POST
def send_otp(request):

    phone = request.POST.get(
        "phone",
        ""
    ).strip()

    # بررسی شماره
    if not re.match(
        r"^09\d{9}$",
        phone
    ):

        return JsonResponse({
            "ok": False,
            "error": "شماره موبایل معتبر نیست."
        })

    # جلوگیری از ثبت شماره تکراری
    if Profile.objects.filter(
        phone=phone
    ).exists():

        return JsonResponse({
            "ok": False,
            "error": "این شماره موبایل قبلاً ثبت شده است."
        })

    # ساخت OTP امن
    code = str(
        secrets.randbelow(90000) + 10000
    )

    request.session["signup_otp"] = {
        "phone": phone,
        "code": code,
        "sent_at": timezone.now().isoformat(),
        "attempts": 0,
    }

    request.session.pop(
        "signup_otp_verified",
        None
    )

    sent = send_otp_sms(
        phone,
        code
    )

    if not sent:

        request.session.pop(
            "signup_otp",
            None
        )

        return JsonResponse({
            "ok": False,
            "error": (
                "ارسال پیامک با خطا مواجه شد. "
                "لطفاً دوباره تلاش کنید."
            )
        })

    return JsonResponse({
        "ok": True
    })


# =========================================================
# VERIFY SIGNUP OTP
# =========================================================

@require_POST
def verify_otp(request):

    phone = request.POST.get(
        "phone",
        ""
    ).strip()

    code = request.POST.get(
        "code",
        ""
    ).strip()

    otp_data = request.session.get(
        "signup_otp"
    )

    if not otp_data:

        return JsonResponse({
            "ok": False,
            "error": (
                "ابتدا روی «ارسال کد تایید» بزنید."
            )
        })

    # بررسی شماره
    if otp_data.get("phone") != phone:

        return JsonResponse({
            "ok": False,
            "error": "شماره موبایل با کد ارسال‌شده مطابقت ندارد."
        })

    # بررسی زمان
    try:

        sent_at = timezone.datetime.fromisoformat(
            otp_data["sent_at"]
        )

    except (KeyError, ValueError):

        request.session.pop(
            "signup_otp",
            None
        )

        return JsonResponse({
            "ok": False,
            "error": "کد تایید نامعتبر است."
        })

    if timezone.now() - sent_at > timedelta(
        minutes=2
    ):

        request.session.pop(
            "signup_otp",
            None
        )

        return JsonResponse({
            "ok": False,
            "error": (
                "کد تایید منقضی شده. "
                "دوباره درخواست کد بده."
            )
        })

    # محدودیت تلاش
    attempts = otp_data.get(
        "attempts",
        0
    )

    if attempts >= 5:

        request.session.pop(
            "signup_otp",
            None
        )

        return JsonResponse({
            "ok": False,
            "error": (
                "تعداد تلاش‌های شما بیش از حد مجاز است. "
                "یک کد جدید دریافت کنید."
            )
        })

    # بررسی کد
    if otp_data.get("code") != code:

        otp_data["attempts"] = attempts + 1

        request.session["signup_otp"] = otp_data

        return JsonResponse({
            "ok": False,
            "error": "کد وارد شده صحیح نیست."
        })

    # موفق
    request.session["signup_otp_verified"] = phone

    return JsonResponse({
        "ok": True
    })


# =========================================================
# SIGNUP
# =========================================================

def signup(request):

    if request.user.is_authenticated:

        return redirect(
            "pages:home"
        )

    if request.method == "POST":

        ajax = _is_ajax(request)

        def fail(message):

            if ajax:

                return JsonResponse(
                    {
                        "ok": False,
                        "error": message
                    },
                    status=400
                )

            messages.error(
                request,
                message
            )

            return render(
                request,
                "signup-signin/singup.html"
            )

        # -------------------------------------------------
        # دریافت اطلاعات
        # -------------------------------------------------

        first_and_last_name = request.POST.get(
            "first-and-last-name",
            ""
        ).strip()

        email = request.POST.get(
            "email",
            ""
        ).strip()

        phone = request.POST.get(
            "phone",
            ""
        ).strip()

        password = request.POST.get(
            "password",
            ""
        )

        password_repeat = request.POST.get(
            "password-repeat",
            ""
        )

        # -------------------------------------------------
        # نام
        # -------------------------------------------------

        if not first_and_last_name:

            return fail(
                "لطفاً نام و نام خانوادگی را وارد کنید."
            )

        # -------------------------------------------------
        # شماره
        # -------------------------------------------------

        if not re.match(
            r"^09\d{9}$",
            phone
        ):

            return fail(
                "شماره موبایل معتبر نیست."
            )

        # -------------------------------------------------
        # ایمیل اختیاری
        # -------------------------------------------------

        if email:

            if not re.match(
                r"^[^@\s]+@[^@\s]+\.[^@\s]+$",
                email
            ):

                return fail(
                    "ایمیل وارد شده معتبر نیست."
                )

            if User.objects.filter(
                email__iexact=email
            ).exists():

                return fail(
                    "این ایمیل قبلاً ثبت شده است."
                )

        # -------------------------------------------------
        # بررسی شماره تکراری
        # -------------------------------------------------

        if Profile.objects.filter(
            phone=phone
        ).exists():

            return fail(
                "این شماره موبایل قبلاً ثبت شده است."
            )

        # -------------------------------------------------
        # بررسی OTP
        # -------------------------------------------------

        verified_phone = request.session.get(
            "signup_otp_verified"
        )

        if verified_phone != phone:

            return fail(
                "لطفاً ابتدا شماره موبایل خود را تایید کنید."
            )

        # -------------------------------------------------
        # پسورد
        # -------------------------------------------------

        if not password:

            return fail(
                "رمز عبور را وارد کنید."
            )

        if password != password_repeat:

            return fail(
                "رمزهای عبور یکسان نیستند."
            )

        if len(password) < 8:

            return fail(
                "رمز عبور باید حداقل ۸ کاراکتر باشد."
            )

        # -------------------------------------------------
        # ساخت User + Profile
        # -------------------------------------------------

        try:

            with transaction.atomic():

                # برای کاربران جدید:
                # شماره موبایل = username

                user = User.objects.create_user(

                    username=phone,

                    email=email,

                    password=password,

                    first_name=first_and_last_name
                )

                Profile.objects.create(

                    user=user,

                    phone=phone,

                    address="",

                    city="",

                    postal_code=""
                )

        except Exception as e:

            print(
                "SIGNUP ERROR:",
                repr(e)
            )

            return fail(
                "ساخت حساب با خطا مواجه شد."
            )

        # -------------------------------------------------
        # Login
        # -------------------------------------------------

        login(
            request,
            user
        )

        # -------------------------------------------------
        # پاک کردن OTP
        # -------------------------------------------------

        request.session.pop(
            "signup_otp",
            None
        )

        request.session.pop(
            "signup_otp_verified",
            None
        )

        # -------------------------------------------------
        # AJAX
        # -------------------------------------------------

        if ajax:

            return JsonResponse({
                "ok": True,
                "redirect_url": reverse(
                    "pages:home"
                )
            })

        messages.success(
            request,
            "حساب شما با موفقیت ساخته شد!"
        )

        return redirect(
            "pages:home"
        )

    return render(
        request,
        "signup-signin/singup.html"
    )


# =========================================================
# LOGOUT
# =========================================================

def logout_view(request):

    logout(request)

    return redirect(
        "pages:home"
    )


# =========================================================
# PROFILE
# =========================================================

@login_required
def profile(request):

    return render(
        request,
        "profile/profile.html",
        {
            "user": request.user
        }
    )


# =========================================================
# PROFILE EDIT
# =========================================================

@login_required
def profile_edit(request):

    profile = request.user.profile

    if request.method == "POST":

        request.user.first_name = request.POST.get(
            "first_name",
            ""
        ).strip()

        request.user.email = request.POST.get(
            "email",
            ""
        ).strip()

        request.user.save()

        profile.address = request.POST.get(
            "address",
            ""
        )

        profile.city = request.POST.get(
            "city",
            ""
        )

        profile.postal_code = request.POST.get(
            "postal_code",
            ""
        )

        if request.FILES.get("image"):

            profile.image = request.FILES["image"]

        profile.save()

        messages.success(
            request,
            "اطلاعات پروفایل با موفقیت بروزرسانی شد."
        )

        return redirect(
            "accounts:profile"
        )

    return render(
        request,
        "profile/profile-edit.html",
        {
            "profile": profile
        }
    )


# =========================================================
# CHANGE PASSWORD
# =========================================================

@login_required
def change_password(request):

    if request.method == "POST":

        old_password = request.POST.get(
            "old_password"
        )

        new_password = request.POST.get(
            "new_password"
        )

        repeat_password = request.POST.get(
            "repeat_password"
        )

        if not request.user.check_password(
            old_password
        ):

            messages.error(
                request,
                "رمز عبور فعلی اشتباه است."
            )

            return redirect(
                "accounts:change-password"
            )

        if new_password != repeat_password:

            messages.error(
                request,
                "رمزهای عبور جدید یکسان نیستند."
            )

            return redirect(
                "accounts:change-password"
            )

        if len(new_password) < 8:

            messages.error(
                request,
                "رمز عبور باید حداقل ۸ کاراکتر باشد."
            )

            return redirect(
                "accounts:change-password"
            )

        request.user.password = make_password(
            new_password
        )

        request.user.save()

        messages.success(
            request,
            "رمز عبور با موفقیت تغییر کرد."
        )

        return redirect(
            "accounts:profile"
        )

    return render(
        request,
        "profile/change-password.html"
    )


# =========================================================
# FAVORITE
# =========================================================

@login_required
@require_POST
def favorite(request):

    return JsonResponse({
        "ok": True
    })