from django.shortcuts import render

# Create your views here.
class MomoWebhookAPI(APIView):

    def get(self, request, *args, **kwargs):        
        # Get order code
        order_code = request.GET.get("order")
        if order_code:
            order = Order.objects.filter(order_code=order_code).first()                     
        
        config = {
            "app_id": 2553,
            "key1": "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
            "key2": "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
            "endpoint": "https://test-payment.momo.vn/pay/store/MOMOIQA420180417-storeid01?a=10000&b=B001221&s=601a7280711dd72bfae8c365801f5e257311a1ebd8779cf3bc4ac57c4002a978",
        }

        params = {
            "app_id": config["app_id"],
            "app_trans_id": order.order_code,  # Input your app_trans_id"
        }

        data = "{}|{}|{}".format(
            config["app_id"], params["app_trans_id"], config["key1"]
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
                payment_id=Payment.objects.filter(code='zalopay').first(),
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
