from django.urls import path, include
from .views import (
    FrameAPI,
    FrameDetailAPI,
    FrameList,
    FrameCreateView,
    FrameEditView,
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
    
    # API Image
    path('api/copy-image', FrameImageCopyAPI.as_view()),
    path('api/upload-full', upload_full, name='upload-full'),
    path('api/upload_cloud', UploadPhotoCloud.as_view()),
    path('api/print', print_photo, name='print_photo'), 
    
    # WEB
    path('', FrameList.as_view(), name='frames'),
    path('add', FrameCreateView.as_view(), name='frames-add'),
    path('edit/<int:pk>', FrameEditView.as_view(), name='frames-edit')
]