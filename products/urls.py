from django.urls import path

from . import views

app_name = "products"


urlpatterns = [
    path('', views.product_list, name='product-list'),
    path('search/', views.search_products, name='search'),
    path('categories/', views.category_list, name='category-list'),
    path('categories/<slug:slug>/', views.single_category, name='single-category'),
    path('<slug:slug>/', views.single_product, name='single-product'),
]