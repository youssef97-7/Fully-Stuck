from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings



class User(AbstractUser):
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    birth_date = models.DateField(null=True, blank=True)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']
    
    def __str__(self):
        return self.username
    


class UserBookRelation(models.Model):
    class Status(models.TextChoices):
        WISHLIST = 'wish', 'Wishlist'
        READ = 'read', 'Read'
        CURRENT = 'current', 'current'
        BORROWED = 'borrowed', 'Borrowed'
        FAVOURITE = 'favourite', 'favourite'
        

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='book_relations'
    )

    book = models.ForeignKey(
        'books.Book',
        on_delete=models.CASCADE,
        related_name='user_relations'
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.WISHLIST
    )

    created_at = models.DateTimeField(auto_now_add=True)

    
    def __str__(self):
        return f"{self.user.username} - {self.book.title} ({self.status})"
