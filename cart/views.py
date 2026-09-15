from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.http import require_POST

from products.models import Product
from .models import Cart, CartItem


def _is_ajax(request):
    return request.headers.get('x-requested-with') == 'XMLHttpRequest'


@login_required
def cart_detail(request):
    cart, _ = Cart.objects.get_or_create(user=request.user)
    items = cart.items.select_related('product').all()
    return render(request, 'cart/cart.html', {
        'cart': cart,
        'items': items,
    })


@login_required
@require_POST
def add_to_cart(request, product_id):
    product = get_object_or_404(Product, id=product_id)
    cart, _ = Cart.objects.get_or_create(user=request.user)

    try:
        quantity = max(1, int(request.POST.get('quantity', 1)))
    except (TypeError, ValueError):
        quantity = 1

    item, created = CartItem.objects.get_or_create(
        cart=cart,
        product=product,
        defaults={'quantity': quantity}
    )
    if not created:
        item.quantity += quantity
        item.save()

    if _is_ajax(request):
        return JsonResponse({
            'ok': True,
            'item_count': cart.items.count(),
            'cart_total': cart.total_price,
        })

    if request.POST.get('buy_now'):
        return redirect('orders:checkout')

    return redirect('cart:cart')


@login_required
@require_POST
def update_quantity(request, item_id):
    item = get_object_or_404(CartItem, id=item_id, cart__user=request.user)
    action = request.POST.get('action')
    deleted = False

    if action == 'increase':
        item.quantity += 1
        item.save()
    elif action == 'decrease':
        item.quantity -= 1
        if item.quantity <= 0:
            item.delete()
            deleted = True
        else:
            item.save()

    cart = item.cart if not deleted else Cart.objects.get(user=request.user)

    if _is_ajax(request):
        return JsonResponse({
            'ok': True,
            'deleted': deleted,
            'quantity': 0 if deleted else item.quantity,
            'item_total': 0 if deleted else item.total_price,
            'cart_total': cart.total_price,
            'item_count': cart.items.count(),
        })

    return redirect('cart:cart')


@login_required
@require_POST
def remove_from_cart(request, item_id):
    item = get_object_or_404(CartItem, id=item_id, cart__user=request.user)
    cart = item.cart
    item.delete()

    if _is_ajax(request):
        return JsonResponse({
            'ok': True,
            'cart_total': cart.total_price,
            'item_count': cart.items.count(),
        })

    return redirect('cart:cart')