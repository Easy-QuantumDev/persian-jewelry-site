from django.contrib import admin
from .models import Category, Product, ProductImage


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "slug",
        "created_at",
    )

    search_fields = (
        "name",
        "slug",
    )

    prepopulated_fields = {
        "slug": ("name",)
    }


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "category",
        "price",
        "stock",
        "is_available",
        "created_at",
    )

    list_filter = (
        "category",
        "is_available",
    )

    search_fields = (
        "name",
        "description",
        "slug",
    )

    prepopulated_fields = {
        "slug": ("name",)
    }


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = (
        "product",
        "alt_text",
        "created_at",
    )

    search_fields = (
        "product__name",
        "alt_text",
    )