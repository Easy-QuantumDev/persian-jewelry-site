from django import forms

from .models import ContactMessage


class ContactForm(forms.ModelForm):
    class Meta:
        model = ContactMessage
        fields = ("name", "email", "phone", "message")
        widgets = {
            "name": forms.TextInput(attrs={"placeholder": "نام و نام خانوادگی"}),
            "email": forms.EmailInput(attrs={"placeholder": "ایمیل (اختیاری)"}),
            "phone": forms.TextInput(attrs={"placeholder": "شماره تلفن (اختیاری)"}),
            "message": forms.Textarea(attrs={"placeholder": "پیام شما", "rows": 5}),
        }
