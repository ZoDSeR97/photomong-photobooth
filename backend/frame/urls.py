from django.urls import path, include
from .views import (
    FrameAPI,
    FrameDetailAPI,
    FrameList,    
    FrameImageCopyAPI,
    UploadPhotoCloud  ,
    ClearImagesAPIView  
)
from .views import upload_full, print_photo

urlpatterns = [
    # API
    path('api', FrameAPI.as_view()),
    path('api/<int:pk>', FrameDetailAPI.as_view()),
    path('api/clear-images', ClearImagesAPIView.as_view(), name='clear-images'),
    path('api/<int:pk>/delete', FrameDetailAPI.as_view(), name='delete-frame'),
    
    # API Image
    path('api/copy-image', FrameImageCopyAPI.as_view()),
    path('api/upload-full', upload_full, name='upload-full'),
    path('api/upload_cloud', UploadPhotoCloud.as_view()),
    path('api/print', print_photo, name='print_photo'), 
    
    # WEB
    path('', FrameList.as_view(), name='frames')    
]