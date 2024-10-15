@echo off
cd backend
start cmd /k "pip install -r requirements.txt && python manage.py runserver 0.0.0.0:8001"
cd ../frontend
start cmd /k "bun install && bun run dev"
start "C:\Program Files\Google\Chrome\Application\chrome.exe --allow-file-access-from-files -kiosk -fullscreen"