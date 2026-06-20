from django.contrib import admin
from .models import PasswordResetToken, User


@admin.register(PasswordResetToken)
class PasswordResetTokenAdmin(admin.ModelAdmin):
    list_display = ("user", "created_at", "expires_at", "verified_at", "used_at")
    search_fields = ("user__email", "user__username")
    list_filter = ("verified_at", "used_at")


admin.site.register(User)
