from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Product(models.Model):
    _id = models.AutoField(primary_key=True, editable=False)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=200,null=True, blank=True)
    image= models.ImageField(upload_to='product/images',null=True,blank=True)
    brand = models.CharField(max_length=200,null=True, blank=True)
    category = models.CharField(max_length=200,null=True, blank=True)
    description =  models.TextField(default='', null=True, blank=True)
    rating = models.DecimalField(max_digits=2,decimal_places=1, null=True, blank=True)
    numReviews = models.IntegerField(default=0, null=True, blank=True)
    price = models.DecimalField(max_digits=7,decimal_places=2, null=True, blank=True)
    countInStock = models.IntegerField(default=0, null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Review(models.Model):
    _id = models.AutoField(primary_key=True, editable=False)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=200,null=True, blank=True)
    rating = models.IntegerField(default=0, null=True, blank=True)
    comment = models.TextField(default='', null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True)