from django.urls import path
from . import views


urlpatterns= [
    path('admin-home/',views.view_admin_home,name='admin_home'),
    path('admin_to_user/',views.view_admint_to_user,name='admin-user'),
    path('delete/<int:book_id>', views.delete_book, name='delete_book'),
    path('edit/<int:book_id>', views.edit_book, name='edit_book'),
    path('add/', views.add_book, name='add_book'),
]