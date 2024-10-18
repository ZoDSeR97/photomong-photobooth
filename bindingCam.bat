REM
echo Starting app.py in WSL with sudo...
start wsl -e bash -c "cd; sudo python3 /home/user/Flask/app.py; exec bash"

@echo off
echo Searching for Canon...

for /f "tokens=1,2,* delims= " %%a in ('usbipd list ^| findstr /C:"Canon"') do (
    set "busid=%%a"
    set "devicename=%%b %%c"
    REM busid 값이 GUID 형식이 아닌 경우에만 설정
    echo %%a | findstr /R "^[0-9]-[0-9]" >nul
    if %errorlevel% equ 0 (
        set "busid=%%a"
        set "devicename=%%b %%c"
        goto :found
    )
)

if not defined busid (
    echo Canon Digital Camera not found. Please check the connection and try again.
    pause
    exit /b
)

:found
REM USBIPD 바인딩 및 연결
echo Found device: %devicename%
echo Binding and attaching Canon Digital Camera with busid: %busid%
usbipd bind --busid %busid% --force
if %errorlevel% neq 0 (
    echo Failed to bind the device. Please check the device status and try again.
    pause
    exit /b
)

usbipd attach --busid %busid% --wsl --auto-attach
if %errorlevel% neq 0 (
    echo Failed to attach the device. It might be already attached or there might be a permission issue.
    echo Please check the device status and try again.
    pause
    exit /b
)