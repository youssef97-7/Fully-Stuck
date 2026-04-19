from django.db import models

# Create your models here.


class User(models.Model):
    fname = models.CharField(max_length=100)
    lname = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=100)
    phone_num = models.CharField(max_length=15)
    Birth_date = models.DateField()
    is_admin = models.BooleanField(default=False)
    def __str__(self):
        return f"{self.fname} {self.lname}"
