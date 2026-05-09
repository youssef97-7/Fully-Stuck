from django.urls import path
from . import views


urlpatterns= [
    path('admin-home/',views.view_admin_home,name='admin_home'),
    path('admin_to_user/',views.view_admint_to_user,name='admin-user')
]