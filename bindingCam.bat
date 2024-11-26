@echo off
echo Searching for Canon...

set "arduinoBusid="

REM Search for Canon camera
for /f "tokens=1,2,* delims= " %%a in ('usbipd list ^| findstr /C:"Canon"') do (
    set "canonBusid=%%a"
    set "canonDevicename=%%b %%c"
    REM Only set busid if it's not in GUID format
    echo %%a | findstr /R "^[0-9]-[0-9]" >nul
    if %errorlevel% equ 0 (
        set "canonBusid=%%a"
        set "canonDevicename=%%b %%c"
        goto :foundCanon
    )
)

if not defined canonBusid (
    echo Canon Digital Camera not found. Please check the connection and try again.
    pause
    exit /b
)

:foundCanon
REM Bind and attach Canon camera
echo Found Canon device: %canonDevicename%
echo Binding and attaching Canon Digital Camera with busid: %canonBusid%
usbipd bind --busid %canonBusid% --force
if %errorlevel% neq 0 (
    echo Failed to bind the Canon device. Please check the device status and try again.
    pause
    exit /b
)

usbipd attach --busid %canonBusid% --wsl --auto-attach
if %errorlevel% neq 0 (
    echo Failed to attach the Canon device. It might be already attached or there might be a permission issue.
    echo Please check the device status and try again.
    pause
    exit /b
)