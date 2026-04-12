
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

function normalizeRating(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return 0;
  return Math.max(0, Math.min(5, num));
}

function normalizeBook(input, id) {
  return {
    id,
    title: String(input.title || "").trim(),
    author: String(input.author || "").trim(),
    coverpage: String(input.coverpage || "").trim(),
    category: String(input.category || "").trim(),
    rating: normalizeRating(input.rating),
    description: String(input.description || "").trim(),
    totalCopies: Number(input.totalCopies || 1),
    availableCopies: Number(input.availableCopies !== undefined ? input.availableCopies : (input.totalCopies || 1))
  };
}

function addBook(input) {
  const book = normalizeBook(input, generateId());
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

  books[i] = normalizeBook({ ...books[i], ...updates }, id);
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
books = books.map((b, index) => normalizeBook(b, b.id || `BK-MIGRATED-${index + 1}`));
saveBooks();


// console.log(book);
