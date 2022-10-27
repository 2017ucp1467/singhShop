from django.shortcuts import render
from django.http import JsonResponse
from .models import Product,Review
from django.contrib.auth.models import User
from django.core.paginator import Paginator,EmptyPage, PageNotAnInteger
from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated,IsAdminUser
from .serializers import ProductSerializer
# Create your views here.

@api_view(['GET'])
def getProducts(request):
    query = request.query_params.get('keyword')
    if query == None:
        query= ''
    products = Product.objects.filter(name__icontains=query)
    page = request.query_params.get('page')
    paginator = Paginator(products,3)
    try:
        products = paginator.page(page)
    except PageNotAnInteger:
        products = paginator.page(1)
    except EmptyPage:
        products = paginator.page(paginator.num_pages)
    
    if page == None or page == 'undefined':
        page = 1
    
    page = int(page)
    serializer = ProductSerializer(products, many=True)
    return Response({'products':serializer.data,'page':page, 'pages':paginator.num_pages})

@api_view(['GET'])
def getTopProducts(request):
    products = Product.objects.filter(rating__gte=4).order_by('-rating')[0:5]
    serializer = ProductSerializer(products,many=True)
    return Response(serializer.data)

@api_view(['GET'])
def getProduct(request, pk):
    try:
        product = Product.objects.get(pk=pk)
    except Product.DoesNotExist:
        return Response({"detail":"No Such Product"},status=status.HTTP_404_NOT_FOUND)
    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated,IsAdminUser])
def createProduct(request):
    user = request.user
    data = request.data
    serializer = ProductSerializer(data=data)
    
    if serializer.is_valid(raise_exception=True):
        obj = serializer.save()
        obj.user = user
        obj.save()
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated,IsAdminUser])
def updateProduct(request,pk):
    product = Product.objects.get(_id=pk)

    data = request.data
    product.name = data.get('name')
    product.price = data.get('price')
    product.countInStock = data.get('countInStock')
    
    if data.get('image'):
        product.image = data.get('image')
    
    product.save()

    serializer = ProductSerializer(product,many=False)
    return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated,IsAdminUser])
def deleteProduct(request, pk):
    product = Product.objects.get(_id=pk)
    product.delete()
    return Response('Product was successfully Deleted.')

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createProductReview(request,pk):
    user = request.user
    product = Product.objects.get(_id=pk)
    data = request.data

    #1- review already exists
    alreadyExist = product.review_set.filter(user=user).exists()
    if alreadyExist:
        content ={'detail':'Product already reviewed'}
        return Response(content,status=status.HTTP_400_BAD_REQUEST)
    #2 - No Rating or 0
    elif data['rating'] == 0:
        content ={'detail':'Please select a rating.'}
        return Response(content,status=status.HTTP_400_BAD_REQUEST)

    #3- create Review
    else:
        review = Review.objects.create(user=user,
            product=product,
            name=user.first_name,
            rating=data.get('rating'),
            comment=data.get('comment'),
        )
            

        reviews = product.review_set.all()
        product.numReviews = len(reviews)
        total=0
        for i in reviews:
            total += i.rating
        product.rating = total/ len(reviews)
        product.save()

        return Response({'detail':'Review Added.'})