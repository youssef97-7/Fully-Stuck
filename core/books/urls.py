from django.urls import path 
from . import views


urlpatterns = [
    path('notifications/',views.notification,name='notifications'),
    path('borrow/<int:id>',views.add_to_borrow, name='add_to_borrow')
]