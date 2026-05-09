from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


# Create your models here.

class Category(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Author(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name



class Book(models.Model):
    title = models.CharField(max_length=255)

    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name='books'
    )

    author = models.ForeignKey(
        Author,
        on_delete=models.CASCADE,
        related_name='books'
    )

    rating = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        validators=[
            MinValueValidator(0),
            MaxValueValidator(5),
        ],
        default=0
    )

    description = models.TextField(null=True, blank=True)

    total_copies = models.PositiveIntegerField()
    available_copies = models.PositiveIntegerField()

    cover = models.ImageField(upload_to='books/', null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title