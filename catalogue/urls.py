from django.urls import path
from .views import getProducts,getProduct,updateProduct,deleteProduct,createProduct,createProductReview,getTopProducts
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
)

urlpatterns = [
    path('', getProducts, name='products'),
    path('<int:pk>/reviews/',createProductReview,name='product-review'),
    path('top/',getTopProducts,name='carousel'),
    path('<int:pk>/', getProduct, name='products'),
    path('create/',createProduct, name='create-product'),
    path('update/<int:pk>/',updateProduct, name='update-product' ),
    path('delete/<int:pk>/',deleteProduct, name='delete-product'),
]