# Generated manually to remove the temporary display_name field.

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_user_display_name'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='display_name',
        ),
    ]
