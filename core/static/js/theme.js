(function () {
    const themeToggle = document.getElementById("theme-toggle");
    const isDark = localStorage.getItem("theme") === "dark";
    if (isDark) {
      document.body.classList.add("dark-mode");
    }
    if (themeToggle) {
      themeToggle.innerHTML = isDark
        ? '<i class="fa-solid fa-sun"></i>'
        : '<i class="fa-solid fa-moon"></i>';
    }
  })();