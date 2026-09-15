from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.hashers import make_password
from django.db import transaction
from django.contrib import messages

from .models import Profile


# ====================== LOGIN ======================
def loggin(request):

    if request.user.is_authenticated:
        return redirect('pages:home')

    if request.method == 'POST':

        email = request.POST.get("email")
        password = request.POST.get("password")

        try:
            user = User.objects.get(
                email__iexact=email
            )

            user = authenticate(
                request,
                username=user.username,
                password=password
            )

        except User.DoesNotExist:
            user = None

        if user is not None:

            login(request, user)

            return redirect('pages:home')

        messages.error(
            request,
            'ایمیل یا پسورد اشتباه است'
        )

        return render(
            request,
            'signup-signin/login.html'
        )

    return render(
        request,
        'signup-signin/login.html'
    )


# ====================== SIGNUP ======================
def signup(request):

    if request.user.is_authenticated:
        return redirect('pages:home')

    if request.method == 'POST':

        first_and_last_name = request.POST.get(
            "first-and-last-name"
        )

        email = request.POST.get("email")

        phone = request.POST.get("phone")

        password = request.POST.get("password")

        password_repeat = request.POST.get(
            "password-repeat"
        )

        # بررسی فیلدهای ضروری
        if not first_and_last_name or not email or not password:

            messages.error(
                request,
                "لطفاً همه فیلدهای ضروری را پر کنید."
            )

            return render(
                request,
                "signup-signin/singup.html"
            )

        # بررسی تکرار پسورد
        if password != password_repeat:

            messages.error(
                request,
                "رمزهای عبور یکسان نیستند."
            )

            return render(
                request,
                "signup-signin/singup.html"
            )

        # بررسی طول پسورد
        if len(password) < 8:

            messages.error(
                request,
                "رمز عبور باید حداقل ۸ کاراکتر باشد."
            )

            return render(
                request,
                "signup-signin/singup.html"
            )

        # بررسی تکراری نبودن ایمیل
        if User.objects.filter(
            email__iexact=email
        ).exists():

            messages.error(
                request,
                "این ایمیل قبلاً ثبت شده است."
            )

            return render(
                request,
                "signup-signin/singup.html"
            )

        # ساخت User و Profile
        with transaction.atomic():

            user = User.objects.create_user(
                username=email,
                email=email,
                password=password,
                first_name=first_and_last_name,
            )

            Profile.objects.create(
                user=user,
                phone=phone,
                address="",
                city="",
                postal_code="",
            )

        # ورود خودکار
        login(request, user)

        messages.success(
            request,
            "حساب شما با موفقیت ساخته شد!"
        )

        return redirect('pages:home')

    return render(
        request,
        'signup-signin/singup.html'
    )


# ====================== LOGOUT ======================
def logout_view(request):

    logout(request)

    messages.success(
        request,
        'با موفقیت از حساب کاربری خارج شدید.'
    )

    return redirect('pages:home')


# ====================== PROFILE ======================
@login_required
def profile(request):

    user = request.user

    # اگر Profile وجود نداشته باشد،
    # به صورت خودکار ساخته می‌شود
    profile, created = Profile.objects.get_or_create(
        user=user
    )

    return render(
        request,
        'profile/profile.html',
        {
            'user': user,
            'profile': profile,
        }
    )


# ====================== PROFILE EDIT ======================
@login_required
def profile_edit(request):

    user = request.user

    # اگر Profile وجود نداشته باشد،
    # به صورت خودکار ساخته می‌شود
    profile, created = Profile.objects.get_or_create(
        user=user
    )

    if request.method == 'POST':

        profile.phone = request.POST.get('phone')

        profile.address = request.POST.get('address')

        profile.city = request.POST.get('city')

        profile.postal_code = request.POST.get(
            'postal_code'
        )

        # بررسی آپلود تصویر
        if request.FILES.get('image'):

            profile.image = request.FILES['image']

        profile.save()

        messages.success(
            request,
            "اطلاعات پروفایل با موفقیت بروزرسانی شد."
        )

        return redirect(
            'accounts:profile'
        )

    return render(
        request,
        'profile/profile.html',
        {
            'user': user,
            'profile': profile,
        }
    )


# ====================== CHANGE PASSWORD ======================
@login_required
def change_password(request):

    user = request.user

    if request.method == 'POST':

        old_password = request.POST.get(
            'old_password'
        )

        new_password1 = request.POST.get(
            'new_password1'
        )

        new_password2 = request.POST.get(
            'new_password2'
        )

        # بررسی رمز فعلی
        if not user.check_password(old_password):

            messages.error(
                request,
                'رمز عبور فعلی اشتباه است.'
            )

            return render(
                request,
                'profile/change_password.html',
                {
                    'user': user
                }
            )

        # بررسی یکسان بودن رمزهای جدید
        if new_password1 != new_password2:

            messages.error(
                request,
                'رمزهای جدید مطابقت ندارند.'
            )

            return render(
                request,
                'profile/change_password.html',
                {
                    'user': user
                }
            )

        # بررسی طول رمز جدید
        if len(new_password1) < 8:

            messages.error(
                request,
                'رمز عبور جدید باید حداقل ۸ کاراکتر باشد.'
            )

            return render(
                request,
                'profile/change_password.html',
                {
                    'user': user
                }
            )

        # تغییر رمز
        user.password = make_password(
            new_password1
        )

        user.save()

        messages.success(
            request,
            'رمز عبور با موفقیت تغییر کرد.'
        )

        return redirect(
            'accounts:profile'
        )

    return render(
        request,
        'profile/change_password.html',
        {
            'user': user
        }
    )


# ====================== FAVORITE ======================
@login_required
def favorite(request):

    return render(
        request,
        'favorite/favorite.html'
    )