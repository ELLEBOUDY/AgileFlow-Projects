from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import AllowAny
from django.contrib.auth import get_user_model
from .serializers import UserRegisterSerializer

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    """
    API endpoint that allows anyone to register a new user.
    """
    queryset = User.objects.all()
    permission_classes = [AllowAny] # No token needed to register
    serializer_class = UserRegisterSerializer
