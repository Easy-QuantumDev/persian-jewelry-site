from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login , logout
from django.contrib.auth.decorators import login_required


def loggin(request):
    if request.user.is_authenticated:
        return redirect('pages:home')
    if request.method == 'POST':
        email = request.POST.get("email")
        password = request.POST.get("password")
        user = authenticate(request,username=email,password=password)
        if user is not None:
            login(request,user)
            return redirect('pages:home')
        return render(request,'signup-signin/login.html',context={'error':'ایمیل یا پسورد اشباه است'})
    return render(request, 'signup-signin/login.html')


def signup(request):
    if request.user.is_authenticated:
        return redirect('pages:home')
    if request.method == 'POST':
        first_and_last_name = request.POST.get("first-and-last-name")
        email = request.POST.get("email")
        password = request.POST.get("password")
        password_repeat = request.POST.get("password-repeat")

        if password != password_repeat:
            return render(request, "signup-signin/singup.html", {
                "error": "رمزهای عبور یکسان نیستند."
            })

        # username نباید فاصله داشته باشه، پس از ایمیل به‌عنوان username استفاده می‌کنیم
        if User.objects.filter(email=email).exists():
            return render(request, "signup-signin/singup.html", {
                "error": "این ایمیل قبلاً ثبت شده است."
            })

        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            first_name=first_and_last_name,
        )
        login(request, user)
        return redirect("pages:home")

    return render(request, 'signup-signin/singup.html')

def logout_view(request):
    logout(request)
    return redirect('pages:home')


@login_required
def profile(request):
    return render(request, 'profile/profile.html')


@login_required
def favorite(request):
    return render(request, 'favorite/favorite.html')