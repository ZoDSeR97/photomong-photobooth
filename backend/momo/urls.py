from django.urls import path, include
from .views import (
    MomoAPI,
    MomoUpdateAPI,
    MomoWebhookAPI,    
)

urlpatterns = [
    path('api', ZaloPayAPI.as_view()),
    path('api/update/<str:order_code>', ZaloPayUpdateAPI.as_view()),
    path('api/webhook', ZaloPayWebhookAPI.as_view()),
]
