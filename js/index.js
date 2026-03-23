const btn = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme');
const login_bakground = document.getElementById('login-page')
const light_login_back ="url('images/lib_img.jpg')"
const dark_login_back = "url('images/dark_iib_img.jpg')"
const home_button = document.getElementById("home-button")
home_button.style.transition = "0.5s"

if(currentTheme == 'dark'){
  document.body.classList.add('dark-mode');
  btn.innerHTML = '<i class="fa-solid fa-sun"></i>';
if (login_bakground) {
    login_bakground.style.backgroundImage = dark_login_back;
    home_button.style.color = "white"
}
}else {
  btn.innerHTML = '<i class="fa-solid fa-moon"></i>';
  if(login_bakground){
      login_bakground.style.backgroundImage = light_login_back;
      home_button.style.color = "black"
  }
}


btn.addEventListener('click', function() {
  document.body.classList.toggle('dark-mode');

  if(document.body.classList.contains('dark-mode')){
    btn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    localStorage.setItem('theme', 'dark');
    login_bakground.style.backgroundImage = dark_login_back;
    home_button.style.color = "white"
  }
  else{
    btn.innerHTML = '<i class="fa-solid fa-moon"></i>';
    localStorage.setItem('theme', 'light');
    login_bakground.style.backgroundImage = light_login_back;
    home_button.style.color = "black"
  }
});


