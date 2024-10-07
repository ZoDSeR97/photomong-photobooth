import requests
from django.shortcuts import render, redirect
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, JSONParser
from rest_framework import status
from rest_framework import permissions
from rest_framework.decorators import api_view
from .models import Frame
from .serializers import FrameSerializer, CloudPhotoSerializer
from django.views import View
from .forms import FrameForm
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib import messages
import os
from django.conf import settings
from django.http import JsonResponse
import base64
from .forms import PhotoForm
from revenue.models import Order
from django.conf import settings
from device.models import Device

import cloudinary.uploader

# Create your views here.
DEVICE_API_URL = settings.DEV_URL + "devices/api"

POSITION_FRAMES = ["row-1-1", "row-1-2", "row-1-3", "row-2-1", "row-2-2", "row-2-3"]

def get_device_list():
    response = requests.get(DEVICE_API_URL)
    if response.status_code == 200:
        return response.json()
    return []

@api_view(['POST'])
def upload_full(request):
    if request.method == 'POST':
          photo_data = ''
          for key, value in request.POST.items():
            if (key == 'photo'):
                photo_data = value         
          if photo_data:                                           
                filename = 'photo.png'
                file_path = os.path.join(settings.BASE_DIR, '../app/public/photo_saved/', filename)
                if os.path.exists(file_path) and os.path.isfile(file_path):
                    os.remove(file_path)
                with open(file_path, 'wb') as f:
                    f.write(base64.b64decode(photo_data.split(',')[1]))
                return JsonResponse({
                    'photo_url': f'/photo_saved/{filename}' if photo_data else None
                }, status=status.HTTP_201_CREATED)                  
    else:
        return JsonResponse({'error': 'Image not provided'}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
def print_photo(request):
    if request.method == 'POST':
        # Copy file to folder for printer
        # Check folder exist
        folder_path = "C:\\Mongta\\Printer-Python\\image"
        if os.path.exists(folder_path):
            image_file = request.data.get('photo')
            frame = request.data.get('frame')
            
            print_url = settings.API_PRINTER_2
            print_file_name = ''
            if frame == 'Stripx2':
                print_file_name = 'stripx2.png'
                print_url = settings.API_PRINTER_CUT
            elif frame == '2cut-x2':
                print_file_name = 'cutx2.png'
                print_url = settings.API_PRINTER_2
            elif frame == '3-cutx2':
                print_file_name = 'cutx3.png'
                print_url = settings.API_PRINTER_3
            elif frame == '4-cutx2':
                print_file_name = 'cutx4.png'
                print_url = settings.API_PRINTER_4
            elif frame == '5-cutx2':
                print_file_name = 'cutx5.png'
                print_url = settings.API_PRINTER_5
            elif frame == '6-cutx2':
                print_file_name = 'cutx6.png'
                print_url = settings.API_PRINTER_6
            if image_file is not None:
                with open(os.path.join(folder_path, print_file_name), 'wb+') as destination:
                    destination.write(base64.b64decode(image_file.split(',')[1]))
                
                # Call POST method to printer                
                response = requests.post(print_url, {})        
        
        return JsonResponse({'message': 'OK'}, status=status.HTTP_200_OK)
    else:
        return JsonResponse({'error': 'Image not provided'}, status=status.HTTP_400_BAD_REQUEST)    
    
                                           
class ClearImagesAPIView(APIView):
    def post(self, request, format=None):
        folder_path = os.path.join(settings.BASE_DIR, '../app/public/photos')
        try:
            files = os.listdir(folder_path)
            for file_name in files:
                if file_name.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')):
                    file_path = os.path.join(folder_path, file_name)
                    os.remove(file_path)
            
            folder_path = os.path.join(settings.BASE_DIR, '../app/public/photo_covers')
            files = os.listdir(folder_path)
            for file_name in files:
                if file_name.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')):
                    file_path = os.path.join(folder_path, file_name)
                    os.remove(file_path)
                
            return Response({"message": "All images cleared successfully"}, status=status.HTTP_200_OK)
        except FileNotFoundError:
            return Response({"error": "Folder not found."}, status=status.HTTP_404_NOT_FOUND)

class UploadPhotoCloud(APIView):
    parser_classes = (
        MultiPartParser,
        JSONParser,
    )
    
    @staticmethod
    def post(request):
        file = request.data.get('photo')
        
        upload_data = cloudinary.uploader.upload(file)     
        
        # Update order's photo_url_done
        order_code = request.data.get('order_code')
        if (order_code):
            order = Order.objects.filter(order_code=order_code).first()
            if order:
                order.photo_url_done = upload_data.get('url')
                order.save()                    
           
        return Response({
            'photo_url': upload_data.get('url')
        }, status=201)

class FrameAPI(APIView):
    
    def get(self, request, *args, **kwargs):
        frames = Frame.objects.exclude(title='3-cutx2').exclude(title='5-cutx2')        

        serializer = FrameSerializer(frames, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        serializer = FrameSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class FrameDetailAPI(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk, *args, **kwargs):
        frame = Frame.objects.get(id=pk)
        serializer = FrameSerializer(frame)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk, *args, **kwargs):
        frame = Frame.objects.get(id=pk)
        serializer = FrameSerializer(instance=frame, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, *args, **kwargs):
        frame = Frame.objects.get(id=pk)
        frame.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class FrameImageCopyAPI(APIView):
    
    def post(self, request, *args, **kwargs):
        photo_url = request.data.get('photo_url')
        photo_cover = request.data.get('photo_cover')
        if photo_url:
            response = requests.get(photo_url)
            if response.status_code == 200:
                filename = os.path.basename(photo_url)
                file_path = os.path.join(settings.BASE_DIR, '../app/public/photos', filename)
                if os.path.exists(file_path) and os.path.isfile(file_path):
                    os.remove(file_path)
                with open(file_path, 'wb') as f:
                    f.write(response.content)

                if photo_cover:
                    response_cover = requests.get(photo_cover)
                    if response_cover.status_code == 200:
                        cover_filename = os.path.basename(photo_cover)
                        cover_path = os.path.join(settings.BASE_DIR, '../app/public/photo_covers', cover_filename)
                        if os.path.exists(cover_path) and os.path.isfile(cover_path):
                            os.remove(cover_path)
                        with open(cover_path, 'wb') as f_cover:
                            f_cover.write(response_cover.content)

                return Response({
                    'photo_path': f'/photos/{filename}',
                    'photo_cover_path': f'/photo_covers/{cover_filename}' if photo_cover else None
                }, status=status.HTTP_201_CREATED)                
        return Response({'error': 'Photo URL is required'}, status=status.HTTP_400_BAD_REQUEST)


class FrameList(LoginRequiredMixin, View):
    template_name = "frames/list.html"

    def get(self, request, *args, **kwargs):
        devices = Device.objects.all()
        frames = Frame.objects.exclude(title='3-cutx2').exclude(title='5-cutx2')
        return render(
            request, self.template_name, {"devices": devices, "frames": frames}
        )


class FrameCreateView(LoginRequiredMixin, View):
    template_name = "frames/add.html"

    def get(self, request, *args, **kwargs):
        devices = Device.objects.all()
        form = FrameForm()
        return render(request, self.template_name, {"form": form, "devices": devices, "positions": POSITION_FRAMES})

    def post(self, request, *args, **kwargs):
        devices = Device.objects.all()
        form = FrameForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect("frames")
        else:
            messages.error(request, form.errors)
        return render(request, self.template_name, {"form": form, "devices": devices, "positions": POSITION_FRAMES})


class FrameEditView(LoginRequiredMixin, View):
    template_name = "frames/edit.html"

    def get(self, request, pk, *args, **kwargs):
        frame = Frame.objects.get(id=pk)
        devices = Device.objects.all()
        form = FrameForm(instance=frame)
        return render(
            request,
            self.template_name,
            {"form": form, "frame": frame, "devices": devices, "positions": POSITION_FRAMES},
        )

    def post(self, request, pk):
        frame = Frame.objects.get(id=pk)
        devices = Device.objects.all()
        form = FrameForm(request.POST, request.FILES, instance=frame)
        if form.is_valid():
            form.save()
            return redirect("frames")
        return render(request, "frames/edit.html", {"form": form, "frame": frame, "devices": devices, "positions": POSITION_FRAMES})
