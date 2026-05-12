from django.shortcuts import get_object_or_404, render, redirect
from django.contrib.auth.decorators import login_required
from books import models as book_models
# Create your views here.


#@login_required
def view_admin_home(request):
    books = book_models.Book.objects.all()
    return render(request,'admin/admin-dashboard.html',{'books' : books})


@login_required
def view_admint_to_user(request):
    return render(request,'admin/admin-to-user.html')


def delete_book(request, book_id):
    if request.method == 'POST':
        book = get_object_or_404(book_models.Book, id =book_id)
        book.delete()
    return redirect('admin_home')
    
def edit_book(request, book_id):
    if request.method == 'POST':
        book = get_object_or_404(book_models.Book, id=book_id)

        # 1. Convert the text strings into Objects
        author_name = request.POST.get('author')
        category_name = request.POST.get('category')
        
        author_object, created = book_models.Author.objects.get_or_create(name=author_name)
        category_object, created = book_models.Category.objects.get_or_create(name=category_name)

        # 2. Assign the actual Objects
        book.author = author_object
        book.category = category_object

        # 3. Map the variables to match models.py EXACTLY
        book.title = request.POST.get('title')
        book.cover = request.POST.get('coverpage') # Maps the HTML 'coverpage' to the DB 'cover'
        book.rating = request.POST.get('rating')
        book.description = request.POST.get('description')
        book.total_copies = request.POST.get('totalCopies') # Maps to snake_case
        book.available_copies = request.POST.get('availableCopies')

        book.save()
        
    return redirect('admin_home')

def add_book(request):
    if request.method == 'POST':
        # 1. Handle the Foreign Keys (Author and Category)
        author_name = request.POST.get('author')
        category_name = request.POST.get('category')
        
        author_object, created = book_models.Author.objects.get_or_create(name=author_name)
        category_object, created = book_models.Category.objects.get_or_create(name=category_name)

        # 2. Create the book with the exact variable names from models.py
        new_book = book_models.Book.objects.create(
            title=request.POST.get('title'),
            author=author_object,
            category=category_object,
            
            # FIX: Match the HTML name="cover"
            cover=request.POST.get('cover'), 
            
            rating=request.POST.get('rating'),
            description=request.POST.get('description'),
            
            # Map the HTML camelCase to the DB snake_case
            total_copies=request.POST.get('totalCopies'), 
            available_copies=request.POST.get('availableCopies')
        )
        
        new_book.save()
        
    return redirect('admin_home')   