from django.shortcuts import render


def product_list(request):
    return render(request, 'product-list/product-list.html')


def category_list(request):
    return render(request, 'category/category.html')


def single_category(request):
    return render(request, 'category/single-category/single-category.html')


def single_product(request):
    return render(request, 'category/single-product-category/single_product.html')
