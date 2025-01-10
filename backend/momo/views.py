from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from datetime import datetime
import json
import hmac
import hashlib
import uuid
import requests
from revenue.models import Transaction, Order
from device.models import Device
from payment.models import Payment
from django.conf import settings


class MomoAPI(APIView):
    def get(self, request, *args, **kwargs):
        # Get MoMo configuration from database
        momo = Payment.objects.filter(code='momo').first()
        
        # Set up configuration based on environment
        config = {
            "partner_code": settings.MOMO_PARTNER_CODE,
            "access_key": settings.MOMO_ACCESS_KEY,
            "secret_key": settings.MOMO_SECRET_KEY,
            "endpoint": settings.MOMO_INVO_URL,
        }

        # Generate unique order info
        order_id = str(uuid.uuid4())
        request_id = str(uuid.uuid4())
        redirect_url = request.build_absolute_uri('/momo/api/callback')
        ipn_url = request.build_absolute_uri(f'/momo/api/webhook?order={order_id}')
        amount = int(request.GET.get("amount", 0))
        
        # Prepare order data
        raw_data = {
            "partnerCode": config["partner_code"],
            "partnerName": "PhotoMong Store",
            "storeId": config["partner_code"],
            "requestId": request_id,
            "amount": amount,
            "orderId": order_id,
            "orderInfo": f"PhotoMong - Payment for order #{order_id}",
            "redirectUrl": redirect_url,
            "ipnUrl": ipn_url,
            "lang": "en",
            "requestType": "captureWallet",
            "autoCapture": True,
            "extraData": "",
        }

        # Create signature
        raw_signature = f"accessKey={config['access_key']}&amount={raw_data['amount']}&extraData={raw_data['extraData']}&ipnUrl={raw_data['ipnUrl']}&orderId={raw_data['orderId']}&orderInfo={raw_data['orderInfo']}&partnerCode={raw_data['partnerCode']}&redirectUrl={raw_data['redirectUrl']}&requestId={raw_data['requestId']}&requestType={raw_data['requestType']}"
        signature = hmac.new(
            config["secret_key"].encode(),
            raw_signature.encode(),
            hashlib.sha256
        ).hexdigest()
        
        raw_data["signature"] = signature

        # Find device if device code is provided
        device_code = request.GET.get("device")
        device = Device.objects.filter(code=device_code).first() if device_code else None

        # Create order in database
        order = Order.objects.create(
            order_code=order_id,
            device_id=device,
            product_price=amount,
            base_price=0,
            tax=0,
            total_price=amount,
            status="Pending",
        )

        # Make request to MoMo
        try:
            response = requests.post(
                f"{config['endpoint']}",
                json=raw_data,
                headers={'Content-Type': 'application/json'}
            )
            result = response.json()

            result_response = {
                "order_code": order_id,
                "return_message": result.get("message"),
                "qr_code": result.get("qrCodeUrl"),
                "return_code": result.get("resultCode"),
                "request_id": request_id,
            }
            
            return Response(result_response, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                "error": str(e)
            }, status=status.HTTP_400_BAD_REQUEST)


class MomoWebhookAPI(APIView):
    def get(self, request, *args, **kwargs):
        data = request.query_params.get("order", None)

        if not data:
            return Response({"message": "Order not found"}, status=status.HTTP_400_BAD_REQUEST)

        # Get order
        order = Order.objects.filter(order_code=data).first()
        if not order:
            return Response({"message": "Order not found"}, status=status.HTTP_404_NOT_FOUND)
        
        if order.status == "Success":
            return Response({
                "order_code": order.order_code,
                "status": "Success",
            }, status=status.HTTP_200_OK)

        return Response({
                "order_code": order.order_code,
                "status": "Pending",
            }, status=status.HTTP_200_OK)


    def post(self, request, *args, **kwargs):
        momo = Payment.objects.filter(code='momo').first()
        data = request.data
        
        # Verify signature
        raw_signature = f"accessKey={settings.MOMO_ACCESS_KEY}&amount={data['amount']}&extraData={data['extraData']}&message={data['message']}&orderId={data['orderId']}&orderInfo={data['orderInfo']}&orderType={data['orderType']}&partnerCode={data['partnerCode']}&payType={data['payType']}&requestId={data['requestId']}&responseTime={data['responseTime']}&resultCode={data['resultCode']}&transId={data['transId']}"
        
        signature = hmac.new(
            settings.MOMO_SECRET_KEY.encode(),
            raw_signature.encode(),
            hashlib.sha256
        ).hexdigest()
        
        if signature != data.get("signature"):
            return Response({"message": "Invalid signature"}, status=status.HTTP_400_BAD_REQUEST)
            
        # Get order
        order = Order.objects.filter(order_code=data["orderId"]).first()
        if not order:
            return Response({"message": "Order not found"}, status=status.HTTP_404_NOT_FOUND)
            
        # Update order status based on resultCode
        if data["resultCode"] == 0:  # Success
            order.status = "Success"
            # Create transaction record
            Transaction.objects.create(
                order_id=order,
                payment_id=momo,
                amount=data["amount"],
                transaction_status="Success",
            )
        elif data["resultCode"] == 1006:  # Transaction timeout
            order.status = "Expired"
        elif data["resultCode"] == 1003:  # Payment pending
            order.status = "Pending"
        else:
            order.status = "Failed"
            
        order.save()
        
        return Response({}, status=status.HTTP_204_NO_CONTENT)


class MomoUpdateAPI(APIView):
    def post(self, request, order_code, *args, **kwargs):
        status_update = request.data.get("status")
        if not order_code:
            return Response({"message": "Order code is required"}, status=status.HTTP_400_BAD_REQUEST)
            
        order = Order.objects.filter(order_code=order_code).first()
        if not order:
            return Response({"message": "Order not found"}, status=status.HTTP_404_NOT_FOUND)
            
        order.status = status_update
        order.save()
        
        return Response({
            "message": "Status updated successfully",
            "order_code": order_code,
            "status": status_update
        }, status=status.HTTP_200_OK)