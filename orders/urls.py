from django.urls import path

from . import views


app_name = 'orders'


urlpatterns = [

    # Checkout
    path(
        'checkout/',
        views.checkout,
        name='checkout'
    ),

    # شروع پرداخت (ریدایرکت به درگاه زرین‌پال)
    path(
        'pay/<str:order_number>/',
        views.start_payment,
        name='start_payment'
    ),

    # کال‌بک تایید پرداخت زرین‌پال
    path(
        'verify/<str:order_number>/',
        views.verify_payment,
        name='verify_payment'
    ),

    # لیست سفارش‌های کاربر
    path(
        'my-orders/',
        views.my_orders,
        name='my_orders'
    ),

    # سفارش موفق
    path(
        'success/<str:order_number>/',
        views.order_success,
        name='order_success'
    ),

    # جزئیات سفارش
    path(
        '<str:order_number>/',
        views.order_detail,
        name='order_detail'
    ),
]