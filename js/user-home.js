(function () {
  const booksContainer = document.getElementById("featuredBooksContainer");
  const searchInput = document.getElementById("searchInput");

  if (!booksContainer || !window.Library) return;

  /** Public pages (e.g. index.html) vs logged-in user area (user/*.html) */
  const isUserArea = /\/user(\/|$)/i.test(window.location.pathname);

  if (typeof Swal !== "undefined" && typeof Swal.mixin === "function") {
    Swal.mixin({ scrollbarPadding: false });
  }

  const ACTION_LABELS = {
    wishlist: "Wishlist",
    favourites: "Favourites",
    "want-to-read": "Want to Read",
    "already-read": "Already Read",
  };

  function resetCardAfterAction(actionBtn) {
    const card = actionBtn.closest(".book-card");
    actionBtn.blur();
    if (document.activeElement && card && card.contains(document.activeElement)) {
      document.activeElement.blur();
    }
    card?.classList.add("book-card--rail-reset");
    return card;
  }

  booksContainer.addEventListener("click", (e) => {
    const actionBtn = e.target.closest("[data-card-action]");
    if (!actionBtn || !booksContainer.contains(actionBtn)) return;

    const action = actionBtn.dataset.cardAction;
    const label = ACTION_LABELS[action];
    if (!label) return;

    e.preventDefault();
    if (typeof Swal === "undefined") return;

    const card = resetCardAfterAction(actionBtn);

    const swalBase = {
      returnFocus: false,
      scrollbarPadding: false,
    };

    const clearRailReset = () => card?.classList.remove("book-card--rail-reset");

    if (!isUserArea) {
      Swal.fire({
        ...swalBase,
        icon: "error",
        title: "Oops...\nplease login first",
        text: "Something went wrong!",
      }).finally(clearRailReset);
      return;
    }

    Swal.fire({
      ...swalBase,
      title: `success add to ${label}`,
      text: "You clicked the button!",
      icon: "success",
    }).finally(clearRailReset);
  });

  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function createBookCard(book) {
    const defaultCover = isUserArea ? "../images/book-1.jpeg" : "images/book-1.jpeg";
    const safeTitle = escapeHtml(book.title || "Untitled");
    const safeAuthor = escapeHtml(book.author || "Unknown author");
    const safeCover = escapeHtml(book.coverpage || defaultCover);
    const safeCategory = escapeHtml(book.category || "General");
    const ratingValue = Number(book.rating);
    const safeRating = Number.isFinite(ratingValue)
      ? Math.max(0, Math.min(5, ratingValue)).toFixed(1)
      : "0.0";

    return `
      <div class="book-card">
        <div class="book-card-media">
          <img src="${safeCover}" alt="${safeTitle}">
          <div class="main-card-hedden">
            <ul class="card-hedden">
              <li><button type="button" data-card-action="wishlist"><i class="fa-solid fa-bookmark"></i></button></li>
              <li><button type="button" data-card-action="favourites"><i class="fa-regular fa-heart"></i></button></li>
              <li><button type="button" data-card-action="want-to-read"><i class="fa-solid fa-plus"></i></button></li>
              <li><button type="button" data-card-action="already-read"><i class="fa-solid fa-check"></i></button></li>
            </ul>
          </div>
        </div>
        <h3>${safeTitle}</h3>
        <p>${safeAuthor}</p>
        <div class="buttom-card">
          <span>${safeCategory}</span>
          <span class="star"><i class="fa-solid fa-star"></i>${safeRating}</span>
        </div>
      </div>
    `;
  }

  function renderBooks(term = "") {
    const allBooks = window.Library.getBooks();
    const normalizedTerm = term.trim().toLowerCase();
    const filteredBooks = normalizedTerm
      ? allBooks.filter((book) => (book.title || "").toLowerCase().includes(normalizedTerm))
      : allBooks;

    if (filteredBooks.length === 0) {
      booksContainer.innerHTML = '<p>No books found.</p>';
      return;
    }

    booksContainer.innerHTML = filteredBooks.map(createBookCard).join("");
  }

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      renderBooks(e.target.value);
    });
  }

  renderBooks();
})();
