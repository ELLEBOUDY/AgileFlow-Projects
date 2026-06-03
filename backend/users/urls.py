from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView

urlpatterns = [
    # 1. Endpoint for Registration
    path('register/', RegisterView.as_view(), name='auth_register'),
    
    # 2. Endpoint for Login (Returns Access and Refresh Tokens)
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    
    # 3. Endpoint to refresh the expired token
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]