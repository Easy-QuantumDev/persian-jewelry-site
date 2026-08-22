from django.urls import path

from . import views

urlpatterns = [
    path('checkout/', views.checkout, name='checkout'),
    path('detail/', views.order_detail, name='order-detail'),
    path('success/', views.order_success, name='order-success'),
]
