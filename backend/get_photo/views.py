from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import os
from django.conf import settings
from django.shortcuts import redirect, render
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views import View
from datetime import datetime

@csrf_exempt
def get_photos(request):
    if request.method == 'GET':
        uuid = request.GET.get('uuid', None)
        upload_dir = os.path.join('upload/uploads',uuid.split("uploads/")[-1].replace("\\","/"))  # 파일을 저장할 디렉터리 경로 설정
        print("###########")
        print("upload_dir")
        print(upload_dir)
        print("###########")
        # 디렉터리 내의 모든 파일 목록을 가져옴
        try:
            file_list = os.listdir(upload_dir)
            print("###########")
            print("file_list")
            print(file_list)
            print("###########")
            # 이미지 파일만 필터링 (예: JPEG, PNG 파일)
            images = [file for file in file_list if file.lower().endswith(('.png', '.jpg', '.jpeg','.mp4'))]
            image_urls = [{'id': idx, 'url': os.path.join(request.build_absolute_uri().split("?")[0].replace("\\","/"), upload_dir.replace("\\","/"), image.replace("\\","/"))} for idx, image in enumerate(images)]
            print("###########")
            print("image_urls")
            print(image_urls)
            print("###########")
            return JsonResponse({'status': 'success', 'images': image_urls})
        except Exception as e:
            print(e)
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    else:
        return JsonResponse({'status': 'error', 'message': 'Invalid request'}, status=400)

from django.http import HttpResponse, Http404
from urllib.parse import quote

def download(request):
    image_path = request.GET.get('image_path', '')
    video_path = request.GET.get('video_path', '')
    uuid = request.GET.get('uuid', '123')    

    try:
        upload_dir = os.path.join(settings.BASE_DIR, 'upload/uploads', uuid)            
        image_urls = [image_path]
        for filename in os.listdir(upload_dir):
            if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
                image_url = os.path.join(request.build_absolute_uri().split("?")[0].replace("\\","/"), upload_dir.replace("\\","/"), filename)
                image_urls.append(f'/get_photo/uploads/{image_url}')

        context = {        
            'image_path': image_path,
            'video_path': video_path,
            'image_urls': image_urls
        }        

        return render(request, 'download.html', context)        
    except FileNotFoundError:
        return HttpResponse("File not found", status=404)


@csrf_exempt    
def serve_photo(request, file_path):
    file_path = os.path.join('upload/uploads', file_path.replace("\\","/"))
    if os.path.exists(file_path):
        with open(file_path, 'rb') as f:
            response = HttpResponse(f.read(), content_type="image/jpeg")
            response['Content-Disposition'] = f'inline; filename={quote(os.path.basename(file_path))}'
            return response
    else:
        raise Http404("File not found")
    
class PhotoListView(LoginRequiredMixin, View):
    
    def get(self, request, *args, **kwargs):        
        uploads_dir = os.path.join(settings.BASE_DIR, 'uploads')
        subfolders = []
        for f in os.scandir(uploads_dir):
            if f.is_dir():
                folder_path = os.path.join(uploads_dir, f.name)
                date_created = datetime.fromtimestamp(os.path.getctime(folder_path))
                subfolders.append({'name': f.name, 'date_created': date_created})
        
        subfolders = sorted(subfolders, key=lambda x: x['date_created'], reverse=True)
        return render(request, 'photo_list.html', {'subfolders': subfolders})          
    
class PhotoDetailView(LoginRequiredMixin, View):

    def get(self, request, folder_id, *args, **kwargs):
        upload_dir = os.path.join(settings.BASE_DIR, 'uploads', folder_id)
        images = [f for f in os.listdir(upload_dir) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
        
        images_view_url = []
        for image in images:
            image_url = os.path.join(request.build_absolute_uri().split("?")[0].replace("\\","/"), upload_dir.replace("\\","/"), image);
            images_view_url.append({
                'url': f'/get_photo/uploads/{image_url}',
                'name': image
            })

        return render(request, 'photo_detail.html', {'folder_id': folder_id, 'images': images_view_url})            
    

class PhotoDeleteView(LoginRequiredMixin, View):

    def post(self, request, folder_id, image, *args, **kwargs):

        if request.method == 'POST':
            try:
                image_path = os.path.join(settings.BASE_DIR, 'uploads', folder_id, image)
                if os.path.exists(image_path):
                    os.remove(image_path)
                    return redirect('photo_detail', folder_id=folder_id)
                else:
                    return HttpResponse('Image not found', status=404)
            except Exception as e:
                return HttpResponse('Image not found', status=404)