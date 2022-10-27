from django.shortcuts import render
from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import IsAuthenticated,IsAdminUser
from rest_framework.response import Response
from rest_framework import status

from .models import Order,OrderItem,ShippingAddress
from catalogue.models import Product
from .serializers import OrderSerializer
from datetime import datetime

# Create your views here.

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addOrderItems(request):
    user = request.user
    data = request.data

    orderItems = data.get('orderItems')

    if orderItems and len(orderItems) == 0:
        return Response({'detail':'No Order Items'},status=status.HTTP_400_BAD_REQUEST)
    else:
        #(1) Create Order

        order = Order.objects.create(
            user=user,
            paymentMethod = data.get('paymentMethod'),
            taxPrice = data.get('taxPrice'),
            shippingPrice = data.get('shippingPrice'),
            totalPrice = data.get('totalPrice')
        )

        #(2) Create shipping address

        shipping = ShippingAddress.objects.create(
            order=order,
            address= data.get('shippingAddress').get('address'),
            city= data.get('shippingAddress').get('city'),
            zipCode= data.get('shippingAddress').get('postalCode'),
            country= data.get('shippingAddress').get('country')
        )

        #(3) Create OrderItems

        for item in orderItems:
            product = Product.objects.get(_id= item.get('_id'))

            orderitem = OrderItem.objects.create(
                product=product,
                order=order,
                name=product.name,
                qty= item.get('qty'),
                price= item.get('price'),
                image= product.image.url,
            )

            #(4) Update Stock
            product.countInStock -= orderitem.qty
        serializer = OrderSerializer(order,many=False)
        return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated,IsAdminUser])
def getAllOrders(request):
    orders = Order.objects.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getMyOrders(request):
    user = request.user
    orders = user.order_set.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getOrderById(request,pk):
    user = request.user

    try:
        order = Order.objects.get(_id=pk)
        if user.is_staff or order.user == user:
            serializer = OrderSerializer(order,many=False)
            return Response(serializer.data)
        else:
            Response({'detail':'Not authorized to view this order'}, status=status.HTTP_400_BAD_REQUEST)
    except:
        return Response({'detail':'Order does not exist'},status=status.HTTP_404_NOT_FOUND)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateOrderToPaid(request,pk):
    order = Order.objects.get(_id=pk)

    order.isPaid = True
    order.paidAt = datetime.now()
    order.save()
    return Response('Order was paid')
