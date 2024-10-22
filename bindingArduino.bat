@echo off
echo Searching for Arduino...

set "arduinoBusid="

REM Search for Arduino
for /f "tokens=1,2,* delims= " %%a in ('usbipd list ^| findstr /C:"Arduino"') do (
    set "arduinoBusid=%%a"
    set "arduinoDevicename=%%b %%c"
    REM Only set busid if it's not in GUID format
    echo %%a | findstr /R "^[0-9]-[0-9]" >nul
    if %errorlevel% equ 0 (
        set "arduinoBusid=%%a"
        set "arduinoDevicename=%%b %%c"
        goto :foundArduino
    )
)

if not defined arduinoBusid (
    echo Arduino not found. Please check the connection and try again.
    pause
    exit /b
)

:foundArduino
REM Bind and attach Arduino
echo Found Arduino device: %arduinoDevicename%
echo Binding and attaching Arduino with busid: %arduinoBusid%
usbipd bind --busid %arduinoBusid% --force
if %errorlevel% neq 0 (
    echo Failed to bind the Arduino device. Please check the device status and try again.
    pause
    exit /b
)

usbipd attach --busid %arduinoBusid% --wsl --auto-attach
if %errorlevel% neq 0 (
    echo Failed to attach the Arduino device. It might be already attached or there might be a permission issue.
    echo Please check the device status and try again.
    pause
    exit /b
)