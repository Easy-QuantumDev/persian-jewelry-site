from django.urls import path
from . import views

app_name = "accounts"

urlpatterns = [
    path('login/', views.loggin, name='login'),
    path('signup/', views.signup, name='signup'),
    path('logout/', views.logout_view, name='logout'),
    path('profile/', views.profile, name='profile'),
    path('favorite/', views.favorite, name='favorite'),
    path('profile/edit/', views.profile_edit, name='profile_edit'),  # اضافه شد
    # در urlpatterns اپ accounts
    path('change-password/', views.change_password, name='change-password'),
]