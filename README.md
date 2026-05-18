# Fully Stuck - Book Management & Reader Platform

A Django-based web application for managing and tracking your reading journey. Keep track of your books, organize them by reading status, and build your personal library.

## Features

- **User Management**: Custom user profiles with email, phone, and birth date
- **Book Catalog**: Browse a comprehensive collection of books organized by category and author
- **Reading Status Tracking**: Organize books into multiple reading statuses:
  - Wishlist
  - Currently Reading
  - Read
  - Borrowed
  - Favorites
- **Book Information**: Detailed book information including:
  - Title and description
  - Author and category
  - Rating (0-5 scale)
  - Cover images
  - Available copies tracking
- **Notifications System**: Receive notifications about your reading activities
- **Responsive Design**: Built with Django and modern web technologies

## Tech Stack

- **Framework**: Django 6.0.4
- **Web Server**: Gunicorn 3.11.1
- **Image Processing**: Pillow 12.2.0
- **Database**: Support for multiple databases
- **Frontend**: HTML5, CSS, JavaScript

## Installation

### Prerequisites

- Python 3.8+
- pip (Python package installer)
- Virtual environment (optional but recommended)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/youssef97-7/Fully-Stuck.git
   cd Fully-Stuck
   ```

2. **Create a virtual environment** (optional)
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r core/requerments.txt
   ```

4. **Navigate to the project directory**
   ```bash
   cd core
   ```

5. **Apply migrations**
   ```bash
   python manage.py migrate
   ```

6. **Create a superuser** (for admin access)
   ```bash
   python manage.py createsuperuser
   ```

7. **Run the development server**
   ```bash
   python manage.py runserver
   ```

   The application will be available at `http://localhost:8000/`

## Project Structure

```
Fully-Stuck/
├── core/                    # Main Django project directory
│   ├── admins/             # Admin module
│   ├── books/              # Book management app
│   │   ├── models.py       # Book, Category, Author, Notification models
│   │   └── views.py        # Book-related views
│   ├── reader/             # User and reading status app
│   │   ├── models.py       # User, UserBookRelation models
│   │   └── views.py        # User-related views
│   ├── manage.py           # Django management script
│   └── requerments.txt     # Project dependencies
├── media/                  # User-uploaded media files
├── static/                 # Static files (CSS, JS, images)
├── templates/              # HTML templates
└── README.md              # This file
```

## Key Models

### User (Custom)
Extended Django's AbstractUser with additional fields:
- Email (unique)
- Phone number
- Birth date

### Book
Complete book information:
- Title, Description
- Category, Author
- Rating (0-5)
- Cover image
- Copy tracking (total/available)

### UserBookRelation
Tracks the relationship between users and books:
- Reading status (Wishlist, Read, Current, Borrowed, Favourite)
- Timestamps for tracking

### Category & Author
Organize books by category and author with relationships

## Usage

1. **Register/Login**: Create a user account or log in to your existing account
2. **Browse Books**: Explore the book catalog
3. **Add to Reading Status**: Add books to your wishlist, current reading, or favorites
4. **Track Progress**: Keep track of books you've read
5. **Manage Library**: Organize your personal book collection

## API & Admin

- **Django Admin**: Access admin panel at `/admin/` with superuser credentials
- **Manage Users**: Add/edit users and their book relationships
- **Manage Catalog**: Add new books, categories, and authors

## Development

### Run Tests
```bash
cd core
python manage.py test
```

### Create Migrations
```bash
cd core
python manage.py makemigrations
python manage.py migrate
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.


## Support

For issues, questions, or suggestions, please open an issue on the GitHub repository.

---

**Start organizing your reading journey with Fully Stuck today!**
