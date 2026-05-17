from django.shortcuts import render, redirect,get_object_or_404
from django.contrib.auth import get_user_model, login, authenticate, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from books import models as book_models
from . import models

# Create your views here.


User = get_user_model()


def view_intro(request):
    book_list = book_models.Book.objects.all()
    return render(request,'index.html',{'book_list' : book_list})


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
            context = {
                'first_name': first_name,
                'last_name': last_name,
                'email': email,
                'phone': phone,
                'birth_date': birth_date,
                'role': role,
                'messages': "Passwords do not match"
            }
            messages.error(request, 'Passwords do not match')
            return render(request, 'signup.html', context)

        if User.objects.filter(email=email).exists():
            context = {
                'first_name': first_name,
                'last_name': last_name,
                'email': email,
                'phone': phone,
                'birth_date': birth_date,
                'role': role,
                'messages': "Email already exists"
            }
            messages.error(request, 'Email already exists')
            return render(request, 'signup.html', context)

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

        
        context = {'messages' : "User registered successfully"}
        return render(request, 'login.html', context)

    return render(request, 'signup.html')


def view_login(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')

        try:
            user_obj = User.objects.get(email=email)
        except User.DoesNotExist:
            messages.error(request, 'Email does not exist')
            return render(request, 'login.html')

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
        
        messages.error(request, 'Invalid password')
        
        return render(request, 'login.html')

    return render(request, 'login.html')

@login_required
def view_user_home(request):
    book_list = book_models.Book.objects.all()
    return render(request,'user/user.html', {'book_list' : book_list})

   
@login_required
def view_currently_read(request):
    user = request.user
    if not user:
        redirect('login')

    book_list = models.UserBookRelation.objects.filter(user=user,status='current').select_related('book')
    context = {'book_list' : book_list}
    return render(request,'user/user_currently_reading.html',context)

@login_required
def view_favourites(request):
    user = request.user
    if not user:
        redirect('login')

    book_list = models.UserBookRelation.objects.filter(user=user,status='favourite').select_related('book')
    context = {'book_list' : book_list}
    return render(request,'user/user_favourites.html',context)

@login_required
def view_wish_list(request):
    user = request.user
    if not user:
        redirect('login')

    book_list = models.UserBookRelation.objects.filter(user=user,status='wish').select_related('book')
    context = {'book_list' : book_list}
    return render(request,'user/user_wishlist.html',context)

@login_required
def view_already_readed(request):
    user = request.user
    if not user:
        redirect('login')

    book_list = models.UserBookRelation.objects.filter(user=user,status='read').select_related('book')
    context = {'book_list' : book_list}
    return render(request,'user/user_already_read.html',context)



@login_required
def view_book_details(request, id):
    book = get_object_or_404(book_models.Book, id=id)
    
    already_borrowed = models.UserBookRelation.objects.filter(
        user=request.user,
        book=book,
        status='borrowed'
    ).exists()
    
    more_books_by_author = book_models.Book.objects.filter(
        author=book.author
    ).exclude(id=id)[:6]

    context = {
        'book': book,
        'already_borrowed': already_borrowed,
        'more_books_by_author': more_books_by_author,
    }
    return render(request, 'user/books_details.html', context)


@login_required
def view_pdf_reader(request):
    return render(request,'user/pdf_reader.html')


@login_required
def view_borrowed(request):
    user=request.user
    book_list = models.UserBookRelation.objects.filter(user=user,status='borrowed').select_related('book')
    return render(request,'user/user_borrowed_books.html',{'book_list' : book_list})
 


def view_logout(request):
    logout(request)
    return render(request, 'login.html')


@login_required
def add_status(request,id):
    user = request.user
    action = request.POST.get('action')
    book = get_object_or_404(book_models.Book,id=id)
    
    if action == "favourites":
        status = 'favourite'
        relation = models.UserBookRelation.objects.filter(
        user=user,
        book=book,
        status='favourite'
    )
    
    if action == "wishlist":
        status = 'wish'
        relation = models.UserBookRelation.objects.filter(
            user=user,
            book=book,
            status='wish'
        )
    
    if action == 'already-read':
        status = 'read'
        relation = models.UserBookRelation.objects.filter(
            user=user,
            book=book,
            status='read'
        )
    
    if action == 'currently-reading':
        status = 'current'
        relation = models.UserBookRelation.objects.filter(
            user=user,
            book=book,
            status='current'
        )
    
    if action == 'remove_from_wishlist':
        relation = models.UserBookRelation.objects.filter(
            user=user,
            book=book,
            status='wish'
        )
        if relation.exists():
            relation.delete()
        return redirect(request.META.get('HTTP_REFERER', '/'))
    
    if action == "remove_from_favourites":
        relation = models.UserBookRelation.objects.filter(
            user=user,
            book=book,
            status='favourite'
        )
        if relation.exists():
            relation.delete()
        return redirect(request.META.get('HTTP_REFERER', '/'))
    
    if action == 'remove_from_currently_reading':
        relation = models.UserBookRelation.objects.filter(
            user=user,
            book=book,
            status='current'
        )
        if relation.exists():
            relation.delete()
        return redirect(request.META.get('HTTP_REFERER', '/'))
    
    if action == 'remove_from_already_read':
        relation = models.UserBookRelation.objects.filter(
            user=user,
            book=book,
            status='read'
        )
        if relation.exists():
            relation.delete()
        return redirect(request.META.get('HTTP_REFERER', '/'))
        

    if relation.exists():
        relation.delete()
    else:
        models.UserBookRelation.objects.create(
            user=user,
            book=book,
            status=status
        )

    return redirect(request.META.get('HTTP_REFERER', '/'))

@login_required
def view_books(request):
    book_list = book_models.Book.objects.all()
    return render(request,'user/user_wants_to_read.html',{'book_list' : book_list})
