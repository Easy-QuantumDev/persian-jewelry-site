from django.shortcuts import render


def checkout(request):
    return render(request, 'checkout/checkout.html')


def order_detail(request):
    return render(request, 'orders/order-detail.html')


def order_success(request):
    return render(request, 'orders/order-success.html')
