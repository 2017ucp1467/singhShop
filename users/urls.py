from django.urls import path
from .views import MyTokenObtainPairView,getUserProfile,getUsers,registerUser,updateUserProfile,deleteUser,getUserById,updateUser

urlpatterns=[
    path('',getUsers,name='all-users'),
    path('register/',registerUser, name='register-user'),
    path('login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('profile/', getUserProfile, name='user-profile'),
    path('profile/update',updateUserProfile, name='user-profile-update'),
    path('<int:pk>/', getUserById, name='user'),
    path('update/<int:pk>/', updateUser, name='update-user'),
    path('delete/<int:pk>/', deleteUser, name='delete-user'),
]