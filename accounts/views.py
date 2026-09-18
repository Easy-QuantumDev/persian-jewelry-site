import random
import re
from datetime import timedelta

from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout, update_session_auth_hash
from django.contrib.auth.decorators import login_required
from django.contrib.auth.hashers import make_password
from django.db import transaction
from django.contrib import messages
from django.http import JsonResponse
from django.urls import reverse
from django.utils import timezone
from django.views.decorators.http import require_POST

from .models import Profile, Favorite
from .sms import send_otp_sms
from orders.models import Order
from products.models import Product


def _is_ajax(request):
    return request.headers.get('x-requested-with') == 'XMLHttpRequest'


# ====================== LOGIN ======================
def loggin(request):
    if request.user.is_authenticated:
        return redirect('pages:home')

    if request.method == 'POST':
        email = request.POST.get("email")
        password = request.POST.get("password")

        try:
            user = User.objects.get(email__iexact=email)
            user = authenticate(request, username=user.username, password=password)
        except User.DoesNotExist:
            user = None

        if user is not None:
            login(request, user)
            return redirect('pages:home')

        messages.error(request, 'ایمیل یا پسورد اشتباه است')
        return render(request, 'signup-signin/login.html')

    return render(request, 'signup-signin/login.html')


# ====================== CHECK EMAIL (AJAX) ======================
def check_email(request):
    email = request.GET.get('email', '').strip()

    if not email:
        return JsonResponse({'available': False, 'error': 'ایمیل وارد نشده است.'})

    taken = User.objects.filter(email__iexact=email).exists()

    return JsonResponse({
        'available': not taken,
        'error': None if not taken else 'این ایمیل قبلاً ثبت شده است.',
    })


# ====================== SEND OTP (AJAX) ======================
@require_POST
def send_otp(request):
    phone = request.POST.get('phone', '').strip()

    if not re.match(r'^09\d{9}$', phone):
        return JsonResponse({'ok': False, 'error': 'شماره موبایل معتبر نیست.'})

    code = str(random.randint(10000, 99999))

    request.session['otp'] = {
        'phone': phone,
        'code': code,
        'sent_at': timezone.now().isoformat(),
    }
    # هر بار کد جدید یعنی تاییدِ قبلی (اگه بود) دیگه معتبر نیست
    request.session.pop('otp_verified_phone', None)

    sent = send_otp_sms(phone, code)

    if not sent:
        return JsonResponse({'ok': False, 'error': 'ارسال پیامک با خطا مواجه شد. لطفاً دوباره تلاش کنید.'})

    return JsonResponse({'ok': True})


# ====================== VERIFY OTP (AJAX) ======================
@require_POST
def verify_otp(request):
    phone = request.POST.get('phone', '').strip()
    code = request.POST.get('code', '').strip()

    otp_data = request.session.get('otp')

    if not otp_data or otp_data.get('phone') != phone:
        return JsonResponse({'ok': False, 'error': 'ابتدا روی «ارسال کد تایید» بزنید.'})

    sent_at = timezone.datetime.fromisoformat(otp_data['sent_at'])
    if timezone.now() - sent_at > timedelta(minutes=2):
        return JsonResponse({'ok': False, 'error': 'کد تایید منقضی شده. دوباره درخواست بده.'})

    if otp_data.get('code') != code:
        return JsonResponse({'ok': False, 'error': 'کد وارد شده صحیح نیست.'})

    request.session['otp_verified_phone'] = phone

    return JsonResponse({'ok': True})


# ====================== SIGNUP ======================
def signup(request):
    if request.user.is_authenticated:
        return redirect('pages:home')

    if request.method == 'POST':
        ajax = _is_ajax(request)

        def fail(msg):
            if ajax:
                return JsonResponse({'ok': False, 'error': msg}, status=400)
            messages.error(request, msg)
            return render(request, "signup-signin/singup.html")

        first_and_last_name = request.POST.get("first-and-last-name")
        email = request.POST.get("email")
        phone = request.POST.get("phone")
        password = request.POST.get("password")
        password_repeat = request.POST.get("password-repeat")

        if not first_and_last_name or not email or not password:
            return fail("لطفاً همه فیلدهای ضروری را پر کنید.")

        if password != password_repeat:
            return fail("رمزهای عبور یکسان نیستند.")

        if len(password) < 8:
            return fail("رمز عبور باید حداقل ۸ کاراکتر باشد.")

        if User.objects.filter(email__iexact=email).exists():
            return fail("این ایمیل قبلاً ثبت شده است.")

        # شماره موبایل باید قبلاً با کد پیامکی تایید شده باشه
        if not phone or request.session.get('otp_verified_phone') != phone:
            return fail("لطفاً ابتدا شماره موبایل را با کد تایید، تایید کنید.")

        with transaction.atomic():
            user = User.objects.create_user(
                username=email,
                email=email,
                password=password,
                first_name=first_and_last_name,
            )
            # ایجاد پروفایل
            Profile.objects.create(
                user=user,
                phone=phone,
                address="",
                city="",
                postal_code="",
            )

        login(request, user)

        # پاک کردن اطلاعات OTP بعد از مصرف شدن
        request.session.pop('otp', None)
        request.session.pop('otp_verified_phone', None)

        if ajax:
            return JsonResponse({'ok': True, 'redirect_url': reverse('pages:home')})

        messages.success(request, "حساب شما با موفقیت ساخته شد!")
        return redirect('pages:home')

    return render(request, 'signup-signin/singup.html')


# ====================== FORGOT PASSWORD ======================
def forgot_password(request):
    if request.user.is_authenticated:
        return redirect('pages:home')

    return render(request, 'signup-signin/forgot-password.html')


@require_POST
def forgot_password_request(request):
    phone = request.POST.get('phone', '').strip()

    if not re.match(r'^09\d{9}$', phone):
        return JsonResponse({'ok': False, 'error': 'شماره موبایل معتبر نیست.'})

    profile = Profile.objects.select_related('user').filter(phone=phone).first()

    if not profile:
        return JsonResponse({'ok': False, 'error': 'کاربری با این شماره موبایل یافت نشد.'})

    user = profile.user

    code = str(random.randint(10000, 99999))

    request.session['reset_otp'] = {
        'user_id': user.id,
        'phone': phone,
        'code': code,
        'sent_at': timezone.now().isoformat(),
    }
    request.session.pop('reset_verified_user_id', None)

    sent = send_otp_sms(phone, code)

    if not sent:
        return JsonResponse({'ok': False, 'error': 'ارسال پیامک با خطا مواجه شد. دوباره تلاش کنید.'})

    return JsonResponse({'ok': True})


@require_POST
def forgot_password_verify(request):
    code = request.POST.get('code', '').strip()

    data = request.session.get('reset_otp')

    if not data:
        return JsonResponse({'ok': False, 'error': 'ابتدا کد تایید را درخواست بده.'})

    sent_at = timezone.datetime.fromisoformat(data['sent_at'])
    if timezone.now() - sent_at > timedelta(minutes=2):
        return JsonResponse({'ok': False, 'error': 'کد تایید منقضی شده. دوباره درخواست بده.'})

    if data.get('code') != code:
        return JsonResponse({'ok': False, 'error': 'کد وارد شده صحیح نیست.'})

    request.session['reset_verified_user_id'] = data['user_id']

    return JsonResponse({'ok': True})


@require_POST
def forgot_password_reset(request):
    password1 = request.POST.get('password1', '')
    password2 = request.POST.get('password2', '')

    user_id = request.session.get('reset_verified_user_id')

    if not user_id:
        return JsonResponse({'ok': False, 'error': 'ابتدا شماره موبایل را با کد تایید، تایید کنید.'})

    if password1 != password2:
        return JsonResponse({'ok': False, 'error': 'رمزهای عبور یکسان نیستند.'})

    if len(password1) < 8:
        return JsonResponse({'ok': False, 'error': 'رمز عبور باید حداقل ۸ کاراکتر باشد.'})

    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return JsonResponse({'ok': False, 'error': 'خطایی رخ داد. دوباره از اول تلاش کنید.'})

    user.set_password(password1)
    user.save()

    request.session.pop('reset_otp', None)
    request.session.pop('reset_verified_user_id', None)

    login(request, user)

    return JsonResponse({'ok': True, 'redirect_url': reverse('pages:home')})


# ====================== LOGOUT ======================
def logout_view(request):
    logout(request)
    messages.success(request, 'با موفقیت از حساب کاربری خارج شدید.')
    return redirect('pages:home')


# ====================== PROFILE ======================
@login_required
def profile(request):
    user = request.user
    profile = user.profile   # این خط باعث ارور می‌شد

    orders = Order.objects.filter(user=user).order_by('-created_at')

    context = {
        'user': user,
        'profile': profile,
        'order_count': orders.count(),
        'recent_orders': orders[:3],
        # هنوز مدل واقعی «علاقه‌مندی‌ها» ساخته نشده، فعلاً صفره
        'favorite_count': 0,
    }

    return render(request, 'profile/profile.html', context)


@login_required
def profile_edit(request):
    user = request.user
    profile = user.profile

    if request.method == 'POST':
        profile.phone = request.POST.get('phone')
        profile.address = request.POST.get('address')
        profile.city = request.POST.get('city')
        profile.postal_code = request.POST.get('postal_code')
        if request.FILES.get('image'):
            profile.image = request.FILES['image']

        profile.save()
        messages.success(request, "اطلاعات پروفایل با موفقیت بروزرسانی شد.")
        return redirect('accounts:profile')

    return render(request, 'profile/profile-edit.html', {'user': user, 'profile': profile})


# ====================== CHANGE PASSWORD ======================
@login_required
def change_password(request):
    user = request.user

    if request.method == 'POST':
        old_password = request.POST.get('old_password')
        new_password1 = request.POST.get('new_password1')
        new_password2 = request.POST.get('new_password2')

        if not user.check_password(old_password):
            messages.error(request, 'رمز عبور فعلی اشتباه است.')
            return render(request, 'profile/change_password.html', {'user': user})

        if new_password1 != new_password2:
            messages.error(request, 'رمزهای جدید مطابقت ندارند.')
            return render(request, 'profile/change_password.html', {'user': user})

        if len(new_password1) < 8:
            messages.error(request, 'رمز عبور جدید باید حداقل ۸ کاراکتر باشد.')
            return render(request, 'profile/change_password.html', {'user': user})

        user.password = make_password(new_password1)
        user.save()

        # بدون این خط، تغییر پسورد یعنی سشن فعلی نامعتبر میشه و کاربر لاگ‌اوت میشه
        update_session_auth_hash(request, user)

        messages.success(request, 'رمز عبور با موفقیت تغییر کرد.')
        return redirect('accounts:profile')

    return render(request, 'profile/change_password.html', {'user': user})


# ====================== FAVORITE ======================
@login_required
def favorite(request):
    favorites = Favorite.objects.filter(user=request.user).select_related('product', 'product__category')
    return render(request, 'favorite/favorite.html', {'favorites': favorites})


@login_required
@require_POST
def toggle_favorite(request, product_id):
    product = get_object_or_404(Product, id=product_id)

    favorite_obj, created = Favorite.objects.get_or_create(user=request.user, product=product)

    if not created:
        favorite_obj.delete()
        is_favorited = False
    else:
        is_favorited = True

    if _is_ajax(request):
        return JsonResponse({
            'ok': True,
            'is_favorited': is_favorited,
            'favorite_count': Favorite.objects.filter(user=request.user).count(),
        })

    next_url = request.META.get('HTTP_REFERER') or reverse('pages:home')
    return redirect(next_url)
# ====================== MY ORDERS ======================
@login_required
def my_orders(request):
    orders = Order.objects.filter(user=request.user).order_by('-created_at')
    return render(request, 'profile/my-orders.html', {'orders': orders})