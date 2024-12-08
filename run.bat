@echo off
set batch1="%~dp0bindingArduino.bat"
set batch2="%~dp0bindingCam.bat"

start wsl -e bash -c "cd; cd Flask/; exec bash"

:: Wait for the batch files to finish, if needed (optional delay or pause)
timeout /t 5 > nul

:: Execute each batch file with admin privileges
PowerShell -Command "Start-Process cmd -ArgumentList '/c %batch1%' -Verb RunAs"
PowerShell -Command "Start-Process cmd -ArgumentList '/c %batch2%' -Verb RunAs"

cd frontend
start cmd /k "pnpm run dev"

:: Wait for the batch files to finish, if needed (optional delay or pause)
timeout /t 5 > nul

echo Starting app.py in WSL with sudo...
start wsl -e bash -c "cd /home/user/Flask; sudo gunicorn -w 1 -b 127.0.0.1:5000 app:app; exec bash"

:: Run kiosk
start chrome.exe --kiosk --touch-events http://localhost:5173