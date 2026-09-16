from django.urls import path

from . import views


app_name = "accounts"


urlpatterns = [

    # Authentication
    path(
        "login/",
        views.loggin,
        name="login"
    ),

    path(
        "signup/",
        views.signup,
        name="signup"
    ),

    path(
        "logout/",
        views.logout_view,
        name="logout"
    ),

    # Email
    path(
        "check-email/",
        views.check_email,
        name="check-email"
    ),

    # Signup OTP
    path(
        "send-otp/",
        views.send_otp,
        name="send-otp"
    ),

    path(
        "verify-otp/",
        views.verify_otp,
        name="verify-otp"
    ),

    # Profile
    path(
        "profile/",
        views.profile,
        name="profile"
    ),

    path(
        "profile/edit/",
        views.profile_edit,
        name="profile-edit"
    ),

    path(
        "change-password/",
        views.change_password,
        name="change-password"
    ),

    path(
        "favorite/",
        views.favorite,
        name="favorite"
    ),
]