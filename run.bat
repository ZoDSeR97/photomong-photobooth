@echo off
set batch1="%~dp0bindingArduino.bat"
set batch2="%~dp0bindingCam.bat"

:: Start WSL
start wsl -e bash -c "cd; cd Flask/; exec bash"

:: Wait for the WSL to start
timeout /t 5 > nul

:: Execute each batch file with admin privileges
PowerShell -Command "Start-Process cmd -ArgumentList '/c %batch1%' -Verb RunAs"
PowerShell -Command "Start-Process cmd -ArgumentList '/c %batch2%' -Verb RunAs"

:: Start frontend server in WSL
start wsl -e bash -c "cd /home/user/frontend; bun run dev; exec bash"

:: Wait for the frontend to initialize
timeout /t 5 > nul

:: Start Flask backend in WSL
echo Starting app.py in WSL with sudo...
start wsl -e bash -c "cd /home/user/Flask; sudo python3 app.py; exec bash"

:: Launch kiosk mode
start chrome.exe --kiosk --touch-events --overscroll-history-navigation=0 http://localhost:5173