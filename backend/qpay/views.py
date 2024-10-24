from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from time import time
from datetime import datetime
import requests
import json, hmac, hashlib, random

# Create your views here.

""" # View for requesting QR payment code
def request_qr_code(request):
    url = "https://merchant-sandbox.qpay.mn/v2/auth/token"

    # Provide your authorization token
    headers = {
        'Authorization': 'Basic YOUR_BASIC_AUTH_TOKEN',  # Add your basic token here
    }

    config = {
        "username": "TEST_MERCHANT",
        "password": "123456",
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
        return JsonResponse({'error': 'Failed to request QR code'}, status=response.status_code) """

class QPayAPI(APIView):
    def get(self, request, *args, **kwargs):
        # QPay authentication credentials
        config = {
            "username": "TEST_MERCHANT",
            "password": "123456",
            "endpoint": "https://merchant-sandbox.qpay.mn/v2/auth/token",
        }

        # Generate unique transaction ID
        transID = random.randrange(1000000)

        # Create the order request data
        order = {
            "invoice_code": "TEST_INVOICE",  # Provided invoice code
            "sender_invoice_no": str(transID),
            "invoice_receiver_code": "83",
            "sender_branch_code": "BRANCH1",
            "invoice_description": f"Order #{transID} Payment",
            "amount": request.GET.get("amount"),
            "callback_url": "https://your-callback-url.com/payments?payment_id=12345678",
        }

        # Send the authentication request to QPay
        auth_response = requests.post(
            url=config["endpoint"],
            auth=(config["username"], config["password"]),
        )

        # Handle authentication response
        if auth_response.status_code == 200:
            token_data = auth_response.json()
            access_token = token_data.get("access_token")

            # Use the token to make a request to create the invoice (order)
            headers = {
                'Authorization': f'Bearer {access_token}',
                'Content-Type': 'application/json'
            }

            invoice_response = requests.post(
                url="https://merchant-sandbox.qpay.mn/v2/invoice",
                headers=headers,
                data=json.dumps(order),
            )

            # Handle the invoice creation response
            if invoice_response.status_code == 200:
                result = invoice_response.json()

                return Response({
                    "invoice_code": order["invoice_code"],
                    "qr_code": result.get("qr_code"),
                    "payment_url": result.get("invoice_url"),
                    "status": "success",
                    "order_id": transID,
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    "error": "Failed to create invoice",
                    "details": invoice_response.text
                }, status=invoice_response.status_code)
        else:
            return Response({
                "error": "Failed to authenticate with QPay",
                "details": auth_response.text
            }, status=auth_response.status_code)


class QPayUpdateAPI(APIView):
    def post(self, request, order_code, *args, **kwargs):
        # Process and update the status of the order
        order_status = request.data.get("status")
        # Update the order in database
        return Response({
            "order_code": order_code,
            "status": order_status,
        }, status=status.HTTP_200_OK)


class QPayWebhookAPI(APIView):
    def get(self, request, *args, **kwargs):
        # Here, you would handle webhook notifications from QPay
        order_code = request.GET.get("order")
        # Implement logic to check order status and update database
        return Response({
            "order_code": order_code,
            "status": "Processed",
        }, status=status.HTTP_200_OK)