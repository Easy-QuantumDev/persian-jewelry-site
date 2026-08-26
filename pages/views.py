from django.shortcuts import render


def home(request):
    return render(request, 'home/home.html')


def about(request):
    return render(request, 'about/about.html')


def contact(request):
    return render(request, 'contact/contact.html')
def notfound(request):
    return render(request, '404/404.html')
