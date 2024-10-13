from django.urls import path
from .views import (
    index,
    payment,
    payment_ipn,
    payment_return,
    query,
    refund
)

urlpatterns = [
    path('', index, name='index'),
    path('payment/', payment, name='payment'),
    path('payment_ipn/', payment_ipn, name='payment_ipn'),
    path('payment_return/', payment_return, name='payment_return'),
    path('query/', query, name='query'),
    path('refund/', refund, name='refund'),
]