from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Book
from .serializers import BookSerializer


@api_view(['GET'])
def book_list(request):
    book = Book.objects.select_related('author').all()
    response = BookSerializer(book, many=True)
    return Response(response.data)
