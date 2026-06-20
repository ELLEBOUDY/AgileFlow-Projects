from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    ChangePasswordView,
    CustomTokenObtainPairView,
    PasswordResetConfirmView,
    PasswordResetRequestView,
    PasswordResetVerifyView,
    RegisterView,
    UserListView,
    CurrentUserView,
)

urlpatterns = [
    # 1. Endpoint for Registration
    path('register/', RegisterView.as_view(), name='auth_register'),

    # 2. Endpoint for Login (Returns Access and Refresh Tokens) - Custom view that accepts email
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),

    # 3. Endpoint to refresh the expired token
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # 4. Endpoints for current user (GET/PATCH/PUT)
    path('me/', CurrentUserView.as_view(), name='current_user'),

    # 5. Endpoint for changing current user's password
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),

    # 6. Forgot password flow
    path('password-reset/request/', PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('password-reset/verify/', PasswordResetVerifyView.as_view(), name='password_reset_verify'),
    path('password-reset/confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),

    path('', UserListView.as_view(), name='user_list'),
]
