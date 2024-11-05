from django.shortcuts import render
from django.views import View
from django.contrib.auth.mixins import LoginRequiredMixin
from django.db.models import Max, Min
from django.utils import timezone
from datetime import datetime, date
from dateutil.relativedelta import relativedelta
from revenue.models import Order, Transaction
from device.models import Device
from store.models import Store

# Create your views here.

class Dashboard(LoginRequiredMixin, View):    
    def get(self, request):
        
        # List stores
        stores = Store.objects.all()
        
        # List devices by store
        devices = Device.objects.all()               
        
        return render(request, 'dashboard.html', {
            'stores': stores,
            'devices': devices,            
        })
        
class DashboardStat(LoginRequiredMixin, View):    
    def get(self, request):
        
        # Get current date
        today = timezone.now().date()
        
        # Set default date range to current month
        default_start_date = date(today.year, today.month, 1)
        default_end_date = default_start_date + relativedelta(months=1, days=-1)
        
        # Get date range from request, or use defaults
        start_date = request.GET.get('start_date', default_start_date.strftime('%Y-%m-%d'))
        end_date = request.GET.get('end_date', default_end_date.strftime('%Y-%m-%d'))
        
        # Convert string dates to datetime objects
        start_datetime = timezone.make_aware(datetime.strptime(start_date, '%Y-%m-%d'))
        end_datetime = timezone.make_aware(datetime.strptime(end_date, '%Y-%m-%d').replace(hour=23, minute=59, second=59))
        
        # Filter transactions
        transactions = Transaction.objects.filter(
            created_at__gte=start_datetime,
            created_at__lte=end_datetime
        ).order_by('-id')
        
        # Calculate statistics based on filtered transactions
        pay_cash = [
            transactions.filter(payment_id__name="Cash").count(),
            transactions.count()
        ]
        pay_QR = [
            transactions.filter(payment_id__name="Zalopay").count(),
            transactions.count()
        ]
        pay_redeem = [
            transactions.filter(payment_id__name="REDEEM").count(),
            transactions.count()
        ]
        
        # Format dates for display
        start_period = start_datetime.strftime('%d.%m.%Y')
        end_period = end_datetime.strftime('%d.%m.%Y')
        
        total_amount = sum(t.amount for t in transactions)
        
        context = {
            'stores': Store.objects.all(),
            'devices': Device.objects.all(),
            'total_amount': total_amount,
            'transactions': transactions,
            "start_period": start_period,
            "end_period": end_period,
            "pay_cash": pay_cash,
            "pay_QR": pay_QR,
            "pay_redeem": pay_redeem,
            "start_date": start_datetime.date(),
            "end_date": end_datetime.date(),
        }
        
        return render(request, 'statistic.html', context)

class DashboardStores(LoginRequiredMixin, View):
    def get(self, request, deviceID):
        # Get store device by store id
        device = Device.objects.get(id=deviceID)
        
        if (device):
            # Get list orders by device id
            orders = Order.objects.filter(device_id=device.id).all()
            
            # Get list transaction by order id
            transactions = Transaction.objects.filter(order_id__in=orders).order_by('-id')
            total_amount = sum(t.amount for t in transactions)
            
            return render(request, 'dashboard-stores.html', {
                'device': device,
                'total_amount': total_amount,
                'transactions': transactions
            })
        return render(request, 'dashboard-stores.html')