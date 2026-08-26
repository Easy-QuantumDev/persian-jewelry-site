from django.contrib import admin
from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0

    readonly_fields = (
        "product_name",
        "price",
        "total_price",
        "created_at",
    )


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):

    list_display = (
        "order_number",
        "user",
        "total_price",
        "status",
        "city",
        "created_at",
    )

    list_filter = (
        "status",
        "created_at",
    )

    search_fields = (
        "order_number",
        "user__username",
        "user__email",
        "first_name",
        "last_name",
        "phone",
        "postal_code",
    )

    readonly_fields = (
        "order_number",
        "created_at",
        "updated_at",
    )

    inlines = [
        OrderItemInline
    ]


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):

    list_display = (
        "order",
        "product_name",
        "price",
        "quantity",
        "total_price",
        "created_at",
    )

    search_fields = (
        "order__order_number",
        "product_name",
    )

    readonly_fields = (
        "created_at",
    )