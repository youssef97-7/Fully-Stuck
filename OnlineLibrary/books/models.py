from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

# Create your models here.


class Author(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name
    

class Category(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Book(models.Model):
    title = models.CharField(max_length=200)
    Rating = models.FloatField(
        validators=[MinValueValidator(0),MaxValueValidator(5)],
        default=5
        )
    description = models.TextField(null=True,blank=True)
    total_copies = models.IntegerField()
    available_copies = models.IntegerField()
    cover_image = models.ImageField(upload_to='books/',null=True,blank=True)
    category = models.ForeignKey(Category,on_delete=models.CASCADE,default="undefined")
    author = models.ForeignKey(Author,on_delete=models.CASCADE,default="undefined")

    def __str__(self):
        return self.title
    