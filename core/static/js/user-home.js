(function () {
  const booksContainer = document.getElementById("featuredBooksContainer");
  const searchInput = document.getElementById("searchInput");

  if (!booksContainer || !window.Library || !window.LibraryBookUI) return;

  const { createLibraryBookCard, bindLibraryCardActions } = window.LibraryBookUI;
  bindLibraryCardActions(booksContainer);

  function renderBooks(term = "") {
    const allBooks = window.Library.getBooks();
    const normalizedTerm = term.trim().toLowerCase();
    const filteredBooks = normalizedTerm
      ? allBooks.filter((book) => (book.title || "").toLowerCase().includes(normalizedTerm))
      : allBooks;

    if (filteredBooks.length === 0) {
      booksContainer.innerHTML = "<p>No books found.</p>";
      return;
    }

    booksContainer.innerHTML = filteredBooks.map(createLibraryBookCard).join("");
  }

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      renderBooks(e.target.value);
    });
  }

  renderBooks();
})();
