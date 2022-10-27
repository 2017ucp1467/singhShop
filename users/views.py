from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import UserSerializer,UserSerializerwithToken
from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated,IsAdminUser
from django.contrib.auth.hashers import make_password
from rest_framework import status

# Create your views here.

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        serializer = UserSerializerwithToken(self.user).data
        for k,v in serializer.items():
            data[k] = v

        return data

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated,IsAdminUser])
def getUsers(request):
    products = User.objects.all()
    serializer = UserSerializer(products, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated,IsAdminUser])
def getUserById(request,pk):
    products = User.objects.get(id=pk)
    serializer = UserSerializer(products, many=False)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateUser(request,pk):
    user = User.objects.get(id=pk)


    data = request.data
    user.first_name = data.get('name')
    user.username = data.get('email')
    user.email = data.get('email')
    user.is_staff = data.get('isAdmin')
    user.save()

    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUserProfile(request):
    user = request.user
    serializer = UserSerializerwithToken(user, many=False)

    data = request.data
    user.first_name = data.get('name')
    user.username = data.get('email')
    user.email = data.get('email')

    if data['password'] != '':
        user.password = make_password(data.get('password'))

    user.save()
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserProfile(request):
    user = request.user
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)

@api_view(['POST'])
def registerUser(request):
    data = request.data
    try:
        user = User.objects.create(
            first_name = data.get('name'),
            username = data.get('email'),
            email = data.get('email'),
            password = make_password(data.get('password'))
        )

        serializer = UserSerializerwithToken(user,many=False)
        return Response(serializer.data)
    except:
        message={'detail':'User with this email already exists.'}
        return Response(message,status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated,IsAdminUser])
def deleteUser(request, pk):
    userForDelete = User.objects.get(id=pk)
    userForDelete.delete()
    return Response('User was deleted.')