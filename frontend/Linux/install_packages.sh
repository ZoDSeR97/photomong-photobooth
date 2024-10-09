#!/bin/bash

# Create a requirements.txt file with the package names (without versions)
cat > requirements.txt << EOL
asgiref
certifi
charset-normalizer
cloudinary
Django
django-cors-headers
djangorestframework
idna
mysqlclient
pillow
python-dotenv
pytz
requests
six
sqlparse
tzdata
urllib3
whitenoise
opencv-python
EOL

# Install the packages from the requirements.txt file
echo "Installing packages..."
pip install -r requirements.txt --upgrade

# Clean up the requirements.txt file
echo "Cleaning up..."
rm requirements.txt

echo "Installation complete!"