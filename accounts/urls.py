from django.urls import path
from . import views

app_name = "accounts"

urlpatterns = [
    path('login/', views.loggin, name='login'),
    path('signup/', views.signup, name='signup'),
    path('check-email/', views.check_email, name='check-email'),
    path('send-otp/', views.send_otp, name='send-otp'),
    path('verify-otp/', views.verify_otp, name='verify-otp'),

    # فراموشی رمز عبور
    path('forgot-password/', views.forgot_password, name='forgot-password'),
    path('forgot-password/request/', views.forgot_password_request, name='forgot-password-request'),
    path('forgot-password/verify/', views.forgot_password_verify, name='forgot-password-verify'),
    path('forgot-password/reset/', views.forgot_password_reset, name='forgot-password-reset'),

    path('logout/', views.logout_view, name='logout'),
    path('profile/', views.profile, name='profile'),
    path('favorite/', views.favorite, name='favorite'),
    path('favorite/toggle/<int:product_id>/', views.toggle_favorite, name='toggle-favorite'),
    path('profile/edit/', views.profile_edit, name='profile-edit'),
    path('change-password/', views.change_password, name='change-password'),
    path('my-orders/', views.my_orders, name='my_orders'),
]