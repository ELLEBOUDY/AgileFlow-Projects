from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
from django.contrib.auth import get_user_model
from .serializers import UserRegisterSerializer, UserSerializer

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = UserRegisterSerializer


class LoginView(TokenObtainPairView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        access_token = response.data.get("access")
        refresh_token = response.data.get("refresh")

        decoded = AccessToken(access_token)
        user = User.objects.get(id=decoded["user_id"])
        user_data = UserSerializer(user).data

        res = Response({
            "access": access_token,
            "user": user_data,
        })

        res.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
            secure=False,
            samesite="Lax",
            max_age=7 * 24 * 60 * 60,
        )

        return res


class CookieTokenRefreshView(APIView):
    permission_classes = [AllowAny]  # ✅ critical — no token needed to refresh

    def post(self, request):
        refresh_token = request.COOKIES.get("refresh_token")

        if not refresh_token:
            return Response(
                {"error": "No refresh token"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        try:
            token = RefreshToken(refresh_token)
            access_token = str(token.access_token)
            return Response({"access": access_token})
        except Exception:
            return Response(
                {"error": "Invalid or expired refresh token"},
                status=status.HTTP_401_UNAUTHORIZED,
            )


class LogoutView(APIView):
    def post(self, request):
        response = Response({"message": "Logged out"})
        response.delete_cookie("refresh_token")
        return response