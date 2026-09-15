from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password

from .models import Profile


class SignupForm(forms.Form):
    full_name = forms.CharField(max_length=150, label="نام و نام خانوادگی")
    email = forms.EmailField(label="ایمیل")
    phone = forms.CharField(max_length=15, required=False, label="شماره موبایل")
    password = forms.CharField(widget=forms.PasswordInput, label="رمز عبور")
    password_repeat = forms.CharField(widget=forms.PasswordInput, label="تکرار رمز عبور")

    def clean_email(self):
        email = self.cleaned_data["email"].strip().lower()
        if User.objects.filter(username=email).exists():
            raise forms.ValidationError("این ایمیل قبلاً ثبت شده است.")
        return email

    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get("password")
        if password and password != cleaned_data.get("password_repeat"):
            self.add_error("password_repeat", "رمزهای عبور یکسان نیستند.")
        if password:
            validate_password(password)
        return cleaned_data


class ProfileForm(forms.ModelForm):
    full_name = forms.CharField(max_length=150, label="نام و نام خانوادگی")

    class Meta:
        model = Profile
        fields = ("phone", "address", "city", "postal_code", "image")
        widgets = {"address": forms.Textarea(attrs={"rows": 3})}

    def __init__(self, *args, user, **kwargs):
        super().__init__(*args, **kwargs)
        self.user = user
        self.fields["full_name"].initial = user.get_full_name()

    def save(self, commit=True):
        self.user.first_name = self.cleaned_data["full_name"].strip()
        if commit:
            self.user.save(update_fields=["first_name"])
        return super().save(commit=commit)
