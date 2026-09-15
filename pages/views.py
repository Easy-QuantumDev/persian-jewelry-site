from django.shortcuts import render

from django.shortcuts import render
 
from products.models import Category
 
 
def home(request):
    categories = Category.objects.all()
 
    sections = []
    for category in categories:
        products = category.products.filter(is_available=True).order_by('-created_at')[:10]
        if products:
            sections.append({'category': category, 'products': products})
 
    context = {
        'categories': categories,
        'sections': sections,
    }
    return render(request, 'home/home.html', context)
def about(request):
    return render(request, 'about/about.html')


def contact(request):
    return render(request, 'contact/contact.html')
def notfound(request):
    return render(request, '404/404.html')
