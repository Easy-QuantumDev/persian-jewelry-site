from django.shortcuts import render


def login(request):
    return render(request, 'signup-signin/login.html')


def signup(request):
    return render(request, 'signup-signin/singup.html')


def profile(request):
    return render(request, 'profile/profile.html')


def favorite(request):
    return render(request, 'favorite/favorite.html')
