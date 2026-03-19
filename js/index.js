const btn = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme');

if(currentTheme == 'dark'){
  document.body.classList.add('dark-mode');
  btn.innerHTML = '<i class="fa-solid fa-sun"></i>';
}else {
  btn.innerHTML = '<i class="fa-solid fa-moon"></i>';
}


btn.addEventListener('click', function() {
  document.body.classList.toggle('dark-mode');

  if(document.body.classList.contains('dark-mode')){
    btn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    localStorage.setItem('theme', 'dark');
  }
  else{
    btn.innerHTML = '<i class="fa-solid fa-moon"></i>';
    localStorage.setItem('theme', 'light');
  }
});


