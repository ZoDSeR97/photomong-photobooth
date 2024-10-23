from django.shortcuts import render
import requests
from django.shortcuts import render, redirect
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from time import time
from datetime import datetime
import json, hmac, hashlib, urllib.request, urllib, urllib.parse, random
from revenue.models import Transaction, Order
from device.models import Device
from payment.models import Payment
from django.conf import settings


# Create your views here.
class MomoAPI(APIView):

    def get(self, request, *args, **kwargs):
        Momo = Payment.objects.filter(code='momo').first()
        config = {
            "app_id": Momo.appID,
            "key1": Momo.key1,
            "key2": Momo.key2,
            "endpoint": Momo.endpoint_sandbox if settings.BACKEND_ENV == 'local' else Momo.endpoint_prod,
        }

        transID = random.randrange(1000000)
        
        order = {
            "app_id": config["app_id"],
            "app_trans_id": "{:%y%m%d}_{}".format(
                datetime.today(), transID
            ), 
            "app_user": "user123",
            "app_time": int(round(time() * 1000)),  # miliseconds
            "embed_data": json.dumps({}),
            "item": json.dumps([{}]),
            "amount": request.GET.get("amount"),
            "description": "PhotoMong - Payment for the order #" + str(transID),
            "bank_code": "Momoapp",
        }

        # app_id|app_trans_id|app_user|amount|apptime|embed_data|item
        data = "{}|{}|{}|{}|{}|{}|{}".format(
            order["app_id"],
            order["app_trans_id"],
            order["app_user"],
            order["amount"],
            order["app_time"],
            order["embed_data"],
            order["item"],
        )

        order["mac"] = hmac.new(
            config["key1"].encode(), data.encode(), hashlib.sha256
        ).hexdigest()

        response = urllib.request.urlopen(
            url=config["endpoint"], data=urllib.parse.urlencode(order).encode()
        )

        # Find device
        device_code = request.GET.get("device")
        if device_code:
            device = Device.objects.filter(code=device_code).first()
        else:
            device = None

        orderObject = Order.objects.create(
            order_code=order["app_trans_id"],
            device_id=device,
            product_price=order["amount"],
            base_price=0,
            tax=0,
            total_price=order["amount"],
            status="Pending",
        )

        result = json.loads(response.read())
        
        result_response = {
            "order_code": order["app_trans_id"],
            "return_message": result.get("return_message"),
            "qr_code": result.get("qr_code"),
            "order_url": result.get("order_url"),
            "return_code": result.get("return_code")
        }
        
        return Response(result_response, status=status.HTTP_200_OK)        


class MomoUpdateAPI(APIView):
    def post(self, request, order_code, *args, **kwargs):                
        status = request.data.get("status")
        if order_code:
            order = Order.objects.filter(order_code=order_code).first()
            if order:
                order.status = status
                order.save()
        return Response(status=status.HTTP_200_OK)


class MomoWebhookAPI(APIView):

    def get(self, request, *args, **kwargs):        
        # Get order code
        order_code = request.GET.get("order")
        if order_code:
            order = Order.objects.filter(order_code=order_code).first()                     
        
        config = {
            "signature": "601a7280711dd72bfae8c365801f5e257311a1ebd8779cf3bc4ac57c4002a978",
            "key1": "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
            "key2": "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
            "endpoint": "https://test-payment.momo.vn/pay/store/",
        }

        params = {
            "storeSlug": "MOMOIQA420180417-storeid01",
            "amount": order.total_price,
            "app_trans_id": order.order_code,  # Input your app_trans_id"
        }

        data = "{}?a={}&b={}&s={}".format(
            params["storeSlug"], params["amount"], params["app_trans_id"], config["signature"]
        )  # app_id|app_trans_id|key1
        params["mac"] = hmac.new(
            config["key1"].encode(), data.encode(), hashlib.sha256
        ).hexdigest()

        response = urllib.request.urlopen(
            url=config["endpoint"], data=urllib.parse.urlencode(params).encode()
        )
        result = json.loads(response.read())
        
        
        if result.get("return_code") == 1:
            order.status = "Success"
        elif result.get("return_code") == 2:
            order.status = "Fail"
        elif result.get("return_code") == 3:
            order.status = "Processing"
        order.save()                
        
        # Create Transaction if Success
        if (order.status == 'Success'):
            Transaction.objects.create(
                order_id=order,
                payment_id=Payment.objects.filter(code='Momo').first(),
                amount=order.total_price,
                transaction_status="Success",
            )
        
        result_response = {
            "order_code": order.order_code,
            "return_message": result.get("return_message"),            
            "return_code": result.get("return_code"),
            "status_real": order.status,
            "status": order.status
        }


        return Response(result_response, status=status.HTTP_200_OK)