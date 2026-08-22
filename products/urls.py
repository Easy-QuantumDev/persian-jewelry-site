from django.urls import path

from . import views

urlpatterns = [
    path('', views.product_list, name='product-list'),
    path('categories/', views.category_list, name='category-list'),
    path('categories/single/', views.single_category, name='single-category'),
    path('detail/', views.single_product, name='single-product'),
]
