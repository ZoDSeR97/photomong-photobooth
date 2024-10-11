from django.conf.urls import url
from .views import (
    index,
    payment,
    payment_ipn,
    payment_return,
    query,
    refund   
)

urlpatterns = [
    url(r'^$', index, name='index'),
    url(r'^payment$', payment, name='payment'),
    url(r'^payment_ipn$', payment_ipn, name='payment_ipn'),
    url(r'^payment_return$', payment_return, name='payment_return'),
    url(r'^query$', query, name='query'),
    url(r'^refund$', refund, name='refund'),
]