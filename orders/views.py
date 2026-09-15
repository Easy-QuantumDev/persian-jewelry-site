import uuid

from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.db import transaction
from django.shortcuts import redirect, render, get_object_or_404

from accounts.models import Profile
from cart.models import Cart
from .models import Order, OrderItem


def _generate_order_number():
    return f"ORD-{uuid.uuid4().hex[:10].upper()}"


# ====================== CHECKOUT ======================
@login_required
def checkout(request):
    profile, _ = Profile.objects.get_or_create(user=request.user)
    cart, _ = Cart.objects.get_or_create(user=request.user)

    if not cart.items.exists():
        messages.warning(request, 'سبد خرید شما خالی است.')
        return redirect('cart:cart')

    missing_info = not profile.phone or not profile.address or not profile.city

    if request.method == 'POST':
        first_name = request.POST.get('first_name', '').strip()
        last_name = request.POST.get('last_name', '').strip()
        phone = request.POST.get('phone', '').strip()
        address = request.POST.get('address', '').strip()
        city = request.POST.get('city', '').strip()
        postal_code = request.POST.get('postal_code', '').strip()

        if not all([first_name, last_name, phone, address, city]):
            messages.error(request, 'لطفاً نام، نام خانوادگی، شماره موبایل، شهر و آدرس را کامل وارد کنید.')
            return render(request, 'checkout/checkout.html', {
                'cart': cart,
                'profile': profile,
                'missing_info': True,
            })

        # اطلاعات رو توی پروفایل کاربر هم ذخیره می‌کنیم تا دفعه‌ی بعد نیاز به وارد کردن دوباره نباشه
        profile.phone = phone
        profile.address = address
        profile.city = city
        if postal_code:
            profile.postal_code = postal_code
        profile.save()

        with transaction.atomic():
            order = Order.objects.create(
                user=request.user,
                order_number=_generate_order_number(),
                first_name=first_name,
                last_name=last_name,
                phone=phone,
                address=address,
                city=city,
                postal_code=postal_code,
                total_price=cart.total_price,
            )

            for item in cart.items.select_related('product'):
                OrderItem.objects.create(
                    order=order,
                    product=item.product,
                    product_name=item.product.name,
                    price=item.product.price,
                    quantity=item.quantity,
                    total_price=item.total_price,
                )

            cart.items.all().delete()

        messages.success(request, 'سفارش شما با موفقیت ثبت شد.')
        return redirect('orders:order-success', order_number=order.order_number)

    return render(request, 'checkout/checkout.html', {
        'cart': cart,
        'profile': profile,
        'missing_info': missing_info,
    })


# ====================== MY ORDERS ======================
@login_required
def my_orders(request):

    orders = Order.objects.filter(
        user=request.user
    ).order_by('-created_at')

    return render(
        request,
        'orders/my-orders.html',
        {
            'orders': orders
        }
    )


# ====================== ORDER DETAIL ======================
@login_required
def order_detail(request, order_number):

    order = get_object_or_404(
        Order,
        order_number=order_number,
        user=request.user
    )

    items = order.items.select_related(
        'product'
    ).all()

    context = {
        'order': order,
        'items': items,
    }

    return render(
        request,
        'orders/order-detail.html',
        context
    )


# ====================== ORDER SUCCESS ======================
@login_required
def order_success(request, order_number):

    order = get_object_or_404(
        Order,
        order_number=order_number,
        user=request.user
    )

    items = order.items.select_related(
        'product'
    ).all()

    context = {
        'order': order,
        'items': items,
    }

    return render(
        request,
        'orders/order-success.html',
        context
    )