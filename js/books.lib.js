(function () {
  const STORAGE_KEY = "library.books.v1";
  let books = [];

  function loadBooks() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      books = raw ? JSON.parse(raw) : [];
    } catch {
      books = [];
    }
  }

  function saveBooks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  }

  function getBooks() {
    return [...books];
  }

  function generateId() {
    // similar vibe to mockup (BK-0921). Good enough for a course project.
    return "BK-" + Math.floor(1000 + Math.random() * 9000);
  }

  function addBook(input) {
    const book = {
      id: generateId(),
      title: input.title.trim(),
      author: input.author.trim(),
      coverpage: input.coverpage.trim(),
      category: input.category.trim(),
      description: input.description.trim(),
    };
    books.unshift(book);
    saveBooks();
    return book;
  }

  function findBookById(id) {
    return books.find(b => b.id === id) || null;
  }

  function updateBook(id, updates) {
    const i = books.findIndex(b => b.id === id);
    if (i === -1) return null;

    books[i] = { ...books[i], ...updates, id };
    saveBooks();
    return books[i];
  }

  function deleteBook(id) {
    const before = books.length;
    books = books.filter(b => b.id !== id);
    if (books.length !== before) saveBooks();
  }

  window.Library = {
    loadBooks,
    getBooks,
    addBook,
    findBookById,
    updateBook,
    deleteBook,
  };

  loadBooks();
})();