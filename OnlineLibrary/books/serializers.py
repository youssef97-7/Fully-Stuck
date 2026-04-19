from .models import *
from rest_framework import serializers



class AuthorSerializer(serializers.ModelSerializer):
    class meta:
        model = Author
        fields = ['name']



class CategorySerializer(serializers.ModelSerializer):
    class meta:
        model = Category
        fields = ['name']


class BookSerializer(serializers.ModelSerializer):

    author = serializers.StringRelatedField()
    category = serializers.StringRelatedField()

    class Meta:
        model = Book
        fields = ['title','Rating','author','category']
        
        