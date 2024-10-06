#!/bin/bash

# Navigate to the backend directory
echo "Navigating to backend directory..."
cd backend

# Install Python dependencies and run Django server in a new terminal
echo "Installing Python dependencies and starting Django server..."
gnome-terminal -- bash -c "pip install -r requirements.txt && python manage.py runserver; exec bash"

# Navigate to the frontend directory
echo "Navigating to frontend directory..."
cd ../frontend

# Install Node.js dependencies and start the frontend in a new terminal
echo "Installing Node.js dependencies and starting frontend in dev mode..."
gnome-terminal -- bash -c "npm install && npm run dev; exec bash"

# Start Google Chrome in fullscreen and kiosk mode
echo "Launching Google Chrome in kiosk mode..."
google-chrome --allow-file-access-from-files --kiosk --fullscreen