from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models

class CustomUserManager(BaseUserManager):
    """
    Custom manager to handle user creation using Email instead of Username.
    """
    def create_user(self, email, username, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        extra_fields.setdefault('role', 'member')
        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'admin')

        return self.create_user(email, username, password, **extra_fields)


class User(AbstractUser):
    """
    Custom User Model optimized for Email authentication.
    """
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('manager', 'Manager'),
        ('member', 'Member'),
    ]
    
    role = models.CharField(
        max_length=10, 
        choices=ROLE_CHOICES, 
        default='member'
    )
    
    # Email is unique and used as the primary identifier
    email = models.EmailField(unique=True)

    # Telling Django to use email for authentication instead of username
    USERNAME_FIELD = 'email' 
    REQUIRED_FIELDS = ['username'] # Required only for createsuperuser command

    objects = CustomUserManager() # Linking our custom manager
    
    def __str__(self):
        return f"{self.email} ({self.get_role_display()})"