from django.urls import path
from . import views


urlpatterns = [
    path('books_list/',views.books_list),
    path('edit_books/<int:id>',views.book_edit),
]