from django.urls import path

from .views import *

app_name = "products"


urlpatterns = [
    path('', product_list, name='product-list'),
    path('categories/', category_list, name='category-list'),
    path('categories/single/', single_category, name='single-category'),
    path('detail/',single_product, name='single-product'),
]
