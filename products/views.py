from django.shortcuts import render, get_object_or_404
from django.core.paginator import Paginator
from django.http import JsonResponse
from django.urls import reverse

from .models import Category, Product
from accounts.models import Favorite


def product_list(request):
    products = Product.objects.filter(is_available=True).select_related('category')

    query = request.GET.get('q', '').strip()
    if query:
        products = products.filter(name__icontains=query)

    selected_category = request.GET.get('category', 'all')
    if selected_category and selected_category != 'all':
        products = products.filter(category__slug=selected_category)

    min_price = request.GET.get('min')
    max_price = request.GET.get('max')
    if min_price:
        products = products.filter(price__gte=min_price)
    if max_price:
        products = products.filter(price__lte=max_price)

    sort = request.GET.get('sort', 'newest')
    if sort == 'cheap':
        products = products.order_by('price')
    elif sort == 'expensive':
        products = products.order_by('-price')
    else:
        products = products.order_by('-created_at')

    paginator = Paginator(products, 9)
    page_obj = paginator.get_page(request.GET.get('page', 1))

    context = {
        'products': page_obj,
        'page_obj': page_obj,
        'categories': Category.objects.all(),
        'selected_category': selected_category,
        'sort': sort,
        'query': query,
    }
    return render(request, 'product-list/product-list.html', context)


def category_list(request):
    context = {
        'categories': Category.objects.all(),
        'new_products': Product.objects.filter(is_available=True).order_by('-created_at')[:8],
    }
    return render(request, 'category/category.html', context)


def single_category(request, slug):
    category = get_object_or_404(Category, slug=slug)
    products = category.products.filter(is_available=True)
    other_categories = Category.objects.exclude(id=category.id)[:4]

    favorite_ids = set()
    if request.user.is_authenticated:
        favorite_ids = set(
            Favorite.objects.filter(
                user=request.user,
                product__in=products,
            ).values_list('product_id', flat=True)
        )

    context = {
        'category': category,
        'products': products,
        'other_categories': other_categories,
        'favorite_ids': favorite_ids,
    }
    return render(request, 'category/single-category/single-category.html', context)


def single_product(request, slug):
    product = get_object_or_404(Product, slug=slug, is_available=True)
    similar_products = Product.objects.filter(
        category=product.category,
        is_available=True,
    ).exclude(id=product.id)[:4]

    context = {
        'product': product,
        'gallery_images': product.images.all(),
        'similar_products': similar_products,
    }
    return render(request, 'category/single-product-category/single_product.html', context)


# ====================== LIVE SEARCH (AJAX) ======================
def search_products(request):
    query = request.GET.get('q', '').strip()

    results = []
    if query:
        products = Product.objects.filter(
            is_available=True,
            name__icontains=query,
        ).select_related('category')[:8]

        for product in products:
            results.append({
                'name': product.name,
                'category': product.category.name,
                'price': f"{product.price:,.0f}",
                'image': product.image.url if product.image else '',
                'url': reverse('products:single-product', args=[product.slug]),
            })

    return JsonResponse({
        'query': query,
        'results': results,
        'view_all_url': f"{reverse('products:product-list')}?q={query}",
    })