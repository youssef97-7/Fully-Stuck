


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





// Feature search

searchInput.addEventListener('input', (e) => {
  const term = e.target.value.toLowerCase();
  const filtered = books.filter(b => b.title.toLowerCase().includes(term));
  displayBooks(filtered);
});



var book = [
  {
    book:"Design System",
    author: "Alla Kholmatova",
    description: "A classic Italian pasta dish with eggs, cheese, and pancetta",
    image:
      "images/book-5.jpeg",
    star:4.5,
    catogray:
    "fiction"

    }
  
  ]










