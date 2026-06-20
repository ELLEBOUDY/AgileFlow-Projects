from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
import secrets

from .models import PasswordResetToken

User = get_user_model()

class UserRegisterSerializer(serializers.ModelSerializer):
    """
    Serializer to handle user registration and password hashing.
    """
    password = serializers.CharField(write_only=True)
    name = serializers.CharField(write_only=True, required=False, allow_blank=True)
    username = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ['id', 'name', 'username', 'email', 'first_name', 'last_name', 'password', 'role']

    def create(self, validated_data):
        full_name = (
            validated_data.pop('name', '').strip()
            or (validated_data.get('username') or '').strip()
        )

        if full_name:
            name_parts = full_name.split()
            first_name = validated_data.get('first_name') or name_parts[0]
            last_name = validated_data.get('last_name') or (name_parts[1] if len(name_parts) > 1 else '')
            username = full_name
        else:
            first_name = validated_data.get('first_name', '')
            last_name = validated_data.get('last_name', '')
            username = f"{first_name} {last_name}".strip() or validated_data['email'].split('@')[0]

        # Ensure uniqueness
        base_username = username
        counter = 1
        while User.objects.filter(username=username).exists():
            username = f"{base_username} {counter}"
            counter += 1

        # CRITICAL: Use create_user to automatically hash the password in MySQL
        user = User.objects.create_user(
            username=username,
            email=validated_data['email'],
            first_name=first_name,
            last_name=last_name,
            password=validated_data['password'],
            role=validated_data.get('role', 'member') # Defaults to member
        )
        return user


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer to fetch and display user profile data.
    Role is read-only to prevent users from changing their own role.
    """
    role = serializers.CharField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role']


class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate_current_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Current password is incorrect.")
        return value

    def validate(self, attrs):
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError({
                'confirm_password': "New password and confirmation do not match."
            })

        if len(attrs['new_password']) < 6:
            raise serializers.ValidationError({
                'new_password': "New password must be at least 6 characters."
            })

        return attrs

    def save(self, **kwargs):
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save(update_fields=['password'])
        return user


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def save(self, **kwargs):
        email = self.validated_data["email"]
        user = User.objects.filter(email__iexact=email).first()
        if not user:
            return None

        if not settings.EMAIL_HOST or not settings.EMAIL_HOST_USER or not settings.EMAIL_HOST_PASSWORD:
            raise serializers.ValidationError({
                "email": "Email service is not configured. Set SMTP values in backend/core/settings.py."
            })

        PasswordResetToken.objects.filter(user=user, used_at__isnull=True).delete()
        code = f"{secrets.randbelow(1000000):06d}"
        PasswordResetToken.create_token(user, code)

        from_email = getattr(settings, "DEFAULT_FROM_EMAIL", None) or getattr(settings, "EMAIL_HOST_USER", None)
        send_mail(
            subject="AgileFlow password reset code",
            message=(
                f"Your AgileFlow verification code is: {code}\n\n"
                "This code expires in 10 minutes."
            ),
            from_email=from_email,
            recipient_list=[user.email],
            fail_silently=False,
        )
        return user


class PasswordResetVerifySerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.CharField(min_length=6, max_length=6)

    def validate(self, attrs):
        user = User.objects.filter(email__iexact=attrs["email"]).first()
        if not user:
            raise serializers.ValidationError({"email": "No user found for this email."})

        token = (
            PasswordResetToken.objects.filter(user=user, used_at__isnull=True)
            .order_by("-created_at")
            .first()
        )
        if not token or token.is_expired():
            raise serializers.ValidationError({"code": "The reset code is invalid or expired."})

        if not token.matches(attrs["code"]):
            raise serializers.ValidationError({"code": "The reset code is invalid or expired."})

        attrs["user"] = user
        attrs["token"] = token
        return attrs

    def save(self, **kwargs):
        token = self.validated_data["token"]
        token.verified_at = timezone.now()
        token.save(update_fields=["verified_at"])
        return token


class PasswordResetConfirmSerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.CharField(min_length=6, max_length=6)
    new_password = serializers.CharField(min_length=6, write_only=True)
    confirm_password = serializers.CharField(min_length=6, write_only=True)

    def validate(self, attrs):
        if attrs["new_password"] != attrs["confirm_password"]:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})

        user = User.objects.filter(email__iexact=attrs["email"]).first()
        if not user:
            raise serializers.ValidationError({"email": "No user found for this email."})

        token = (
            PasswordResetToken.objects.filter(user=user, used_at__isnull=True, verified_at__isnull=False)
            .order_by("-created_at")
            .first()
        )
        if not token or token.is_expired() or not token.matches(attrs["code"]):
            raise serializers.ValidationError({"code": "The reset code is invalid or expired."})

        attrs["user"] = user
        attrs["token"] = token
        return attrs

    def save(self, **kwargs):
        user = self.validated_data["user"]
        token = self.validated_data["token"]
        user.set_password(self.validated_data["new_password"])
        user.save(update_fields=["password"])
        token.used_at = timezone.now()
        token.save(update_fields=["used_at"])
        PasswordResetToken.objects.filter(user=user, used_at__isnull=True).exclude(id=token.id).delete()
        return user
