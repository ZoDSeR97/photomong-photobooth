@echo off
echo Searching for Camera...

REM Search for Canon camera
for /f "tokens=1,2,* delims= " %%a in ('usbipd list ^| findstr /C:"Canon" /C:"DC-GH5" /C:"DC-GH5S"') do (
    set "cameraBusid=%%a"
    set "cameraDevicename=%%b %%c"
    REM Only set busid if it's not in GUID format
    echo %%a | findstr /R "^[0-9]-[0-9]" >nul
    if %errorlevel% equ 0 (
        set "cameraBusid=%%a"
        set "cameraDevicename=%%b %%c"
        goto :foundDevice
    )
)

if not defined cameraBusid (
    echo Camera not found. Please check the connection and try again.
    pause
    exit /b
)

:foundDevice
REM Bind and attach Canon camera
echo Found Camera device: %cameraDevicename%
echo Binding and attaching Canon Digital Camera with busid: %cameraBusid%
usbipd bind --busid %cameraBusid% --force
if %errorlevel% neq 0 (
    echo Failed to bind the Canon device. Please check the device status and try again.
    pause
    exit /b
)

usbipd attach --busid %cameraBusid% --wsl --auto-attach
if %errorlevel% neq 0 (
    echo Failed to attach the Canon device. It might be already attached or there might be a permission issue.
    echo Please check the device status and try again.
    pause
    exit /b
)