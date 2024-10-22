from django.shortcuts import render
from django.http import JsonResponse
import requests

# Create your views here.

# View for requesting QR payment code
def request_qr_code(request):
    url = "https://merchant-sandbox.qpay.mn/v2/auth/token"

    # Provide your authorization token
    headers = {
        'Authorization': 'Basic YOUR_BASIC_AUTH_TOKEN',  # Add your basic token here
    }

    # Make the request to QPay
    response = requests.post(url, headers=headers)

    # Check if the request was successful
    if response.status_code == 200:
        # Assume response contains a QR code or token needed for payment
        qr_data = response.json()
        return JsonResponse(qr_data)  # Return the response as JSON

    else:
        # Handle error case
        return JsonResponse({'error': 'Failed to request QR code'}, status=response.status_code)