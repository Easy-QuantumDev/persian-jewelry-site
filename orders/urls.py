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