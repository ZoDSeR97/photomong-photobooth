from django.urls import path, include
from .views import (
  BackgroundAPI,
  BackgroundDetailAPI,
  BackgroundList,
  BackgroundCreateView,
  BackgroundEditView
)

urlpatterns = [
  # API
  path('api', BackgroundAPI.as_view()),
  path('api/<int:pk>', BackgroundDetailAPI.as_view()),
  # WEB
  path('', BackgroundList.as_view(), name='backgrounds'),
  path('add', BackgroundCreateView.as_view(), name='backgrounds-add'),
  path('edit/<int:pk>', BackgroundEditView.as_view(), name='backgrounds-edit')
]
