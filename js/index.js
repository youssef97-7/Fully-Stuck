const btn = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme');
const login_bakground = document.getElementById('login-page') || document.getElementById('signup-page');
const light_login_back = "url('images/lib_img.jpg')";
const dark_login_back = "url('images/dark_iib_img.jpg')";
const home_button = document.getElementById("home-button");
const skipHomeButtonColor = home_button && home_button.closest(".auth-card");

if (home_button) {
  home_button.style.transition = "0.5s";
}

if (currentTheme == 'dark') {
  document.body.classList.add('dark-mode');
  if (btn) btn.innerHTML = '<i class="fa-solid fa-sun"></i>';


  if (login_bakground) login_bakground.style.backgroundImage = dark_login_back;
  if (home_button && !skipHomeButtonColor) home_button.style.color = "white";
} else {
  document.body.classList.remove('dark-mode');
  if (btn) btn.innerHTML = '<i class="fa-solid fa-moon"></i>';

  if (login_bakground) login_bakground.style.backgroundImage = light_login_back;
  if (home_button && !skipHomeButtonColor) home_button.style.color = "black";
}

if (btn) {
  btn.addEventListener('click', function () {
    document.body.classList.toggle('dark-mode');

    if (document.body.classList.contains('dark-mode')) {
      btn.innerHTML = '<i class="fa-solid fa-sun"></i>';
      localStorage.setItem('theme', 'dark');

      if (login_bakground) login_bakground.style.backgroundImage = dark_login_back;
      if (home_button && !skipHomeButtonColor) home_button.style.color = "white";
    }
    else {
      btn.innerHTML = '<i class="fa-solid fa-moon"></i>';
      localStorage.setItem('theme', 'light');
      if (login_bakground) login_bakground.style.backgroundImage = light_login_back;
      if (home_button && !skipHomeButtonColor) home_button.style.color = "black";
    }
  });
}



///////// home ////////

const categories = [
  { title: "Fiction", count: "850k+", icon: "📚" },
  { title: "Science", count: "420k+", icon: "🧪" },
  { title: "History", count: "310k+", icon: "📜" },
  { title: "Tech", count: "250k+", icon: "💻" },
  { title: "Philosophy", count: "180k+", icon: "🧠" },
  { title: "Arts", count: "150k+", icon: "🎨" }
];

const container = document.getElementById('category-container');

if (container) {
  categories.forEach(item => {
    const card = document.createElement('div');
    card.className = 'category-card';

    card.innerHTML = `
      <div class="icon">${item.icon}</div>
      <h3>${item.title}</h3>
      <p>${item.count} titles</p>
    `;

    container.appendChild(card);
  });
}

const bookDetailsButton = document.getElementsByClassName('book-img');
if (bookDetailsButton) {
  Array.from(bookDetailsButton).forEach(button => {
    button.addEventListener('click', () => {
      window.location.href = 'books_details.html';
    });
  });
}

// ===== BOOK DETAILS PAGE SCRIPTS =====

// Theme toggle for book details
const btn1 = document.getElementById('theme-toggle');
if (btn) {
  const icon = btn.querySelector('i');
  if (icon) {
    function applyTheme() {
      const dark = document.body.classList.contains('dark-mode');
      icon.className = dark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }
    applyTheme();
    btn.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const isDark = document.body.classList.contains('dark-mode');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      applyTheme();
    });
  }
}

// Borrow button feedback
const borrowBtn = document.querySelector('.borrow-btn');
if (borrowBtn) {
  borrowBtn.addEventListener('click', function () {
    this.innerHTML = '<i class="fa-solid fa-check"></i> Borrowed!';
    this.style.background = '#16a34a';
    this.disabled = true;
  });
}

// Make all images clickable to go to book details
const allImages = document.querySelectorAll('img');
allImages.forEach(img => {
  img.style.cursor = 'pointer';
  img.addEventListener('click', () => {
    window.location.href = 'books_details.html';
  });
});

const container1 = document.getElementById('category-container');

if (container) {
  categories.forEach(item => {
    const card = document.createElement('div');
    card.className = 'category-card';

    card.innerHTML = `
      <div class="icon">${item.icon}</div>
      <h3>${item.title}</h3>
      <p>${item.count} titles</p>
    `;

    container.appendChild(card);
  });
}