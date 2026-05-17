from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404, redirect

from reader import models as reader_models

from . import models


def notification(request):
    if request.method == 'POST':
        name = request.POST.get('full_name')
        email = request.POST.get('email')
        subject = request.POST.get('subject')
        message = request.POST.get('message')

        models.Notification.objects.create(
            full_name=name,
            email=email,
            subject=subject,
            message=message,
        )
    return redirect(request.META.get('HTTP_REFERER', '/'))


@login_required
def add_to_borrow(request, id):
    book = get_object_or_404(models.Book, id=id)

    if request.method != 'POST':
        return redirect('book_details', id=id)

    if reader_models.UserBookRelation.objects.filter(
        user=request.user,
        book=book,
        status='borrowed',
    ).exists():
        messages.warning(request, 'You have already borrowed this book.')
        return redirect('book_details', id=id)

    if book.available_copies <= 0:
        messages.error(request, 'This book is not available to borrow.')
        return redirect('book_details', id=id)

    book.available_copies -= 1
    book.save()
    reader_models.UserBookRelation.objects.create(
        user=request.user,
        book=book,
        status='borrowed',
    )
    messages.success(request, 'Book borrowed successfully.')
    return redirect('book_details', id=id)