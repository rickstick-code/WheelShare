# Generated by Django 4.1.3 on 2024-01-22 14:55

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('yamod', '0012_type_vehicle'),
    ]

    operations = [
        migrations.AddField(
            model_name='vehicle',
            name='owner',
            field=models.ManyToManyField(to=settings.AUTH_USER_MODEL),
        ),
    ]
