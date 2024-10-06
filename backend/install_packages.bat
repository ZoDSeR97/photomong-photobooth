@echo off
echo Creating requirements.txt file...

rem Create a requirements.txt file with the package names (without versions)
(
echo asgiref
echo certifi
echo charset-normalizer
echo cloudinary
echo Django
echo django-cors-headers
echo djangorestframework
echo idna
echo mysqlclient
echo pillow
echo python-dotenv
echo pytz
echo requests
echo six
echo sqlparse
echo tzdata
echo urllib3
echo whitenoise
) > requirements.txt

echo Installing packages...

rem Install the packages from the requirements.txt file
pip install -r requirements.txt --upgrade

rem Clean up the requirements.txt file
echo Cleaning up...
del requirements.txt

echo Installation complete!
pause