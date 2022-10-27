from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField(read_only=True)
    _id = serializers.IntegerField(source='id',read_only=True)
    isAdmin = serializers.BooleanField(source='is_staff')
    class Meta:
        model= User
        fields = ['_id','username','email','name','isAdmin']

    def get_name(self,obj):
        name = obj.first_name
        if name == '':
            name = obj.email
        return name

class UserSerializerwithToken(UserSerializer):
    token = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model= User
        fields = ['_id','username','email','name','isAdmin','token']

    def get_token(self,obj):
        token = RefreshToken.for_user(obj)
        return str(token.access_token)