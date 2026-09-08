from django.shortcuts import render
from .models import  Product
def products(request):
    product =Product.objects.all()
    query = request.POST.get('q')
    if query:
        product = product.objects.filter(name__icontains=query)
        return render(request,'product-list.html',{product:"product"})


def product_list(request):
    return render(request, 'product-list/product-list.html')


def category_list(request):
    return render(request, 'category/category.html')


def single_category(request):
    return render(request, 'category/single-category/single-category.html')


def single_product(request):
    return render(request, 'category/single-product-category/single_product.html')
