from django.urls import path
from .views import (
    Dashboard,
    DashboardStores,
    DashboardStat
)

urlpatterns = [
    path('', Dashboard.as_view(), name='dashboard'),
    path('statistic', DashboardStat.as_view(), name='statistic'),
    path('device/<int:deviceID>', DashboardStores.as_view(), name='dashboard-stores'),
]