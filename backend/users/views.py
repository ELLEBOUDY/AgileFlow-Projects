from django.shortcuts import render
from rest_framework import generics
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny,IsAuthenticated
from django.contrib.auth import get_user_model
from .serializers import UserRegisterSerializer,UserSerializer

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    """
    API endpoint that allows anyone to register a new user.
    """
    queryset = User.objects.all()
    permission_classes = [AllowAny] # No token needed to register
    serializer_class = UserRegisterSerializer

class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]