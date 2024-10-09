from django.urls import path, include
from .views import (
    MomoAPI,
    MomoUpdateAPI,
    MomoWebhookAPI,    
)

urlpatterns = [
    path('api', MomoAPI.as_view()),
    path('api/update/<str:order_code>', MomoUpdateAPI.as_view()),
    path('api/webhook', MomoWebhookAPI.as_view()),
]
