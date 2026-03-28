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











