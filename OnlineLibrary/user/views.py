from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializer import UserSerializer
from .models import User

# Create your views here.

@api_view(['GET'])
def user_list(request):
    users = User.objects.all()
    response = UserSerializer(users, many=True)
    return Response(response.data)
