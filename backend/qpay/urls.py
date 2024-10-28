from django.urls import path, include
from .views import (
    QPayAPI,
    QPayUpdateAPI,
    QPayWebhookAPI,    
)

urlpatterns = [
    path('api', QPayAPI.as_view()),
    path('api/update/<str:order_code>', QPayUpdateAPI.as_view()),
    path('api/webhook', QPayWebhookAPI.as_view()),
]