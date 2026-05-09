from django.urls import path 
from . import views

urlpatterns = [
    path('signup/', views.view_register, name='signup'),
    path('login/', views.view_login, name='login'),
    path('home/', views.view_user_home, name='user_home'),

    path('book/<int:id>/', views.view_book_details, name='book_details'),
    path('book/pdf/<int:id>/', views.view_pdf_reader, name='pdf_reader'),

    path('books/read/', views.view_already_readed, name='already_read'),
    path('books/borrowed/', views.view_borrowed, name='borrowed'),
    path('books/current/', views.view_currently_read, name='currently_read'),
    path('books/favourites/', views.view_favourites, name='favourites'),
    path('books/wishlist/', views.view_wish_list, name='wishlist'),

    path('logout/', views.view_logout, name='logout'),

]