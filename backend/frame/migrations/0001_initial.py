# Generated by Django 5.1.3 on 2024-11-06 09:06

import cloudinary.models
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('device', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='CloudPhoto',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', cloudinary.models.CloudinaryField(max_length=255, verbose_name='image')),
            ],
        ),
        migrations.CreateModel(
            name='Frame',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.TextField()),
                ('photo', models.ImageField(upload_to='frames')),
                ('photo_hover', models.ImageField(default='frames/default.png', upload_to='frames')),
                ('position', models.TextField(default='center')),
                ('price', models.DecimalField(decimal_places=0, max_digits=10)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('deleted_at', models.DateTimeField(auto_now_add=True)),
                ('device_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='device.device')),
            ],
        ),
    ]