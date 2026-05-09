from django.shortcuts import render, redirect
from django.contrib.auth import get_user_model, login, authenticate, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from . import models

# Create your views here.


User = get_user_model()


def view_intro(request):
    return render(request,'index.html')

def view_register(request):
    if request.method == 'POST':

        first_name = request.POST.get('firstName')
        last_name = request.POST.get('lastName')
        email = request.POST.get('email')
        phone = request.POST.get('phone')
        password = request.POST.get('password')
        confirm_password = request.POST.get('confirmPassword')
        birth_date = request.POST.get('birthDate')
        role = request.POST.get('role')

        if password != confirm_password:
            messages.error(request, "Passwords do not match")
            return redirect('signup')

        if User.objects.filter(email=email).exists():
            messages.error(request, "Email already exists")
            return redirect('signup')

        username = email.split('@')[0]

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
        )

        user.phone = phone
        user.birth_date = birth_date

        if role == "admin":
            user.is_staff = True

        user.save()

        login(request, user)
        messages.success(request, "Account created successfully")
        return redirect('user_home')

    return render(request, 'signup.html')


def view_login(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')

        try:
            user_obj = User.objects.get(email=email)
        except User.DoesNotExist:
            messages.error(request, "Invalid credentials")
            return redirect('login')

        user = authenticate(
            request,
            username=user_obj.username,
            password=password
        )

        if user is not None:
            login(request, user)

            if user.is_staff:
                return redirect('admin_home')

            return redirect('user_home')

        messages.error(request, "Invalid credentials")
        return redirect('login')

    return render(request, 'login.html')

@login_required
def view_user_home(request):
    return render(request,'user/user.html')

@login_required
def view_book_details(request):
    return render(request,'user/books_details.html')

@login_required
def view_pdf_reader(request):
    return render(request,'user/pdf_reader.html')

@login_required
def view_already_readed(request):
    return render(request,'user/user_already_read.html')

@login_required
def view_borrowed(request):
    return render(request,'user/user_borrowed_books.html')
    
@login_required
def view_currently_read(request):
    return render(request,'user/user_currently_reading.html')

@login_required
def view_favourites(request):
    return render(request,'user/user_favourites.html')

@login_required
def view_wish_list(request):
    return render(request,'user/user_wishlist.html')


def view_logout(request):
    logout(request)
    messages.success(request, "Logged out successfully")
    return redirect('login')
