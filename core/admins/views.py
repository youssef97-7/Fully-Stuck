from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from books import models as book_models
# Create your views here.


@login_required
def view_admin_home(request):
    books = book_models.Book.objects.all()
    return render(request,'admin/admin-dashboard.html',{'books' : books})


@login_required
def view_admint_to_user(request):
    return render(request,'admin/admin-to-user.html')