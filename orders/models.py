from django.db import models
from django.contrib.auth.models import User
from products.models import Product


class Order(models.Model):

    STATUS_CHOICES = [
        ("pending", "در انتظار پرداخت"),
        ("paid", "پرداخت شده"),
        ("processing", "در حال پردازش"),
        ("shipped", "ارسال شده"),
        ("delivered", "تحویل داده شده"),
        ("cancelled", "لغو شده"),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="orders"
    )

    order_number = models.CharField(
        max_length=20,
        unique=True
    )

    first_name = models.CharField(
        max_length=100
    )

    last_name = models.CharField(
        max_length=100
    )

    phone = models.CharField(
        max_length=15
    )

    address = models.TextField()

    city = models.CharField(
        max_length=100
    )

    postal_code = models.CharField(
        max_length=10
    )

    total_price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending"
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Order {self.order_number}"
class OrderItem(models.Model):

    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name="items"
    )

    product = models.ForeignKey(
        Product,
        on_delete=models.PROTECT,
        related_name="order_items"
    )

    product_name = models.CharField(
        max_length=200
    )

    price = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    quantity = models.PositiveIntegerField(
        default=1
    )

    total_price = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return f"{self.product_name} × {self.quantity}"