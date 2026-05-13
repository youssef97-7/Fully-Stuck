from django.shortcuts import render, redirect
from . import models
# Create your views here.


def notification(request):
    if request.method == 'POST':
        print(request.POST)  # 👈 مهم جدًا
        name = request.POST.get('full_name')
        email = request.POST.get('email')
        #reciever = 
        subject = request.POST.get('subject')
        message = request.POST.get('message')

        models.Notification.objects.create(
            full_name = name,
            email = email,
            subject = subject,
            message = message
        )
    return redirect(request.META.get('HTTP_REFERER', '/'))