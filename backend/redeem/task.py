from celery import shared_task
from django.utils import timezone
from .models import Redeem
from django.core.mail import send_mail
from django.conf import settings

@shared_task
def generate_new_code():
    # Deactivate old codes
    RedeemCode.objects.filter(is_active=True).update(is_active=False)

    # Create a new code
    new_code = RedeemCode.objects.create(
        expires_at=timezone.now() + timezone.timedelta(hours=1)
    )

    # Send email notification to admin
    send_mail(
        'New Redeem Code Generated',
        f'The new redeem code is {new_code.code}',
        settings.DEFAULT_FROM_EMAIL,
        [settings.ADMIN_EMAIL]
    )