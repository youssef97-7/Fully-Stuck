from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from books import models as book_models
from books import serializers as books_ser

# Create your views here.

# api to view all books, adding books
@api_view(['GET','POST'])
def books_list(request):
    if request.method == 'GET':
        books = book_models.Book.objects.all()
        list_serializer = books_ser.BookSerializer(books, many=True)
        return Response(list_serializer.data)

    elif request.method == 'POST':
        serializer = books_ser.BookSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)        
        else:
            return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)
    
        

# api to 
@api_view(['GET','PUT','DELETE'])
def book_edit(request,id):
    try:
        book = book_models.Book.objects.get(pk=id)
    except book_models.Book.DoesNotExist:
        return Response({"error": "Book not found"}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'PUT':
        serializer = books_ser.BookSerializer(book, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'GET':
        serializer = books_ser.BookSerializer(book)
        return Response(serializer.data)
    
    elif request.method == 'DELETE':
        book.delete()
        return Response('deleted')


