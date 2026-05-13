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
    book_list = book_models.Book.objects.all()
    return render(request,'admin/admin-to-user.html',{'book_list' : book_list})


def delete_book(request, book_id):
    if request.method == 'POST':
        book = get_object_or_404(book_models.Book, id =book_id)
        book.delete()
    return redirect('admin_home')
    
def edit_book(request, book_id):
    if request.method == 'POST':
        book = get_object_or_404(book_models.Book, id=book_id)

        author_name = request.POST.get('author')
        category_name = request.POST.get('category')
        
        author_object, created = book_models.Author.objects.get_or_create(name=author_name)
        category_object, created = book_models.Category.objects.get_or_create(name=category_name)

        book.author = author_object
        book.category = category_object

        book.title = request.POST.get('title')
        book.cover = request.POST.get('coverpage')
        book.rating = request.POST.get('rating')
        book.description = request.POST.get('description')
        book.total_copies = request.POST.get('totalCopies')
        book.available_copies = request.POST.get('availableCopies')

        book.save()
        
    return redirect('admin_home')

def add_book(request):
    if request.method == 'POST':
        author_name = request.POST.get('author')
        category_name = request.POST.get('category')
        
        author_object, created = book_models.Author.objects.get_or_create(name=author_name)
        category_object, created = book_models.Category.objects.get_or_create(name=category_name)

        new_book = book_models.Book.objects.create(
            title=request.POST.get('title'),
            author=author_object,
            category=category_object,
            
            cover=request.POST.get('cover'), 
            
            rating=request.POST.get('rating'),
            description=request.POST.get('description'),

            total_copies=request.POST.get('totalCopies'), 
            available_copies=request.POST.get('availableCopies')
        )
        
        new_book.save()
        
    return redirect('admin_home')   