from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import os

@csrf_exempt
def upload_file(request):
    if request.method == 'POST':
        file = request.FILES.get('file', None)
        uuid = request.POST.get('uuid', None) 
        if file:
            # 파일을 저장할 디렉터리 경로 설정
            upload_dir = os.path.join('uploads',uuid)
            # uploads 디렉터리가 없다면 생성
            os.makedirs(upload_dir, exist_ok=True)
            # 파일 경로 조합
            file_path = os.path.join(upload_dir, file.name)

            # 파일 저장
            try:
                with open(file_path, 'wb') as destination:
                    for chunk in file.chunks():
                        destination.write(chunk)
                return JsonResponse({'status': 'success', 'message': 'File has been uploaded successfully.'})
            except IOError as e:
                return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
        else:
            return JsonResponse({'status': 'error', 'message': 'No file provided.'})
    else:
        return JsonResponse({'status': 'error', 'message': 'Invalid request'}, status=400)
