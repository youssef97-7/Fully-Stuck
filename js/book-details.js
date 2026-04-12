/**
 * Book Details Page - Load and display book data dynamically
 */
(function (global) {
  console.log('book-details.js loaded');

  function getUrlParams() {
    const params = new URLSearchParams(global.location.search);
    return {
      id: params.get('id')
    };
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function isUserAreaPath() {
    return /\/user(\/|$)/i.test(global.location.pathname);
  }

  function resolveCover(book) {
    const userArea = isUserAreaPath();
    const fallback = userArea ? "../images/book-1.jpeg" : "images/book-1.jpeg";
    const cp = String(book.coverpage || "").trim();
    if (!cp) return fallback;
    if (/^https?:\/\//i.test(cp)) return cp;
    if (userArea && cp.startsWith("images/")) return "../" + cp;
    return cp;
  }

  function loadBookDetails() {
    const params = getUrlParams();
    const bookId = params.id;

    if (!bookId || !global.Library) {
      console.error('Book ID not found in URL parameters');
      return;
    }

    const book = global.Library.findBookById(bookId);
    if (!book) {
      console.error('Book not found:', bookId);
      return;
    }

    document.title = `${escapeHtml(book.title)} – Library`;

    const detailsContainer = document.getElementById('bookDetailsContent');
    if (!detailsContainer) {
      console.error('Book details container not found');
      return;
    }

    const ratingValue = Number(book.rating);
    const safeRating = Number.isFinite(ratingValue)
      ? Math.max(0, Math.min(5, ratingValue)).toFixed(1)
      : '0.0';

    const availStatus = book.availableCopies > 0 ? 'Ready to Borrow' : 'Not Available';
    const borrowLabel = book.availableCopies > 0 ? 'Borrow This Book' : 'Not Available';
    const borrowIcon = book.availableCopies > 0 ? 'fa-book-open' : 'fa-ban';

    detailsContainer.innerHTML = `
      <div class="cover-col">
        <div class="cover-wrap">
          <img src="${escapeHtml(resolveCover(book))}" alt="${escapeHtml(book.title)} cover" />
        </div>
        <div class="meta-box">
          <div class="meta-row">
            <span class="lbl">Title</span>
            <span class="val">${escapeHtml(book.title)}</span>
          </div>
          <div class="meta-row">
            <span class="lbl">Author</span>
            <span class="val">${escapeHtml(book.author)}</span>
          </div>
          <div class="meta-row">
            <span class="lbl">ISBN</span>
            <span class="val">${escapeHtml(book.id)}</span>
          </div>
          <div class="meta-row">
            <span class="lbl">Category</span>
            <span class="val">${escapeHtml(book.category)}</span>
          </div>
          <div class="meta-row">
            <span class="lbl">Total Copies</span>
            <span class="val">${escapeHtml(String(book.totalCopies))}</span>
          </div>
          <div class="meta-row">
            <span class="lbl">Available</span>
            <span class="val">${escapeHtml(String(book.availableCopies))}</span>
          </div>
        </div>
      </div>
      <div class="info-col">
        <h1>${escapeHtml(book.title)}</h1>
        <p class="author-name">${escapeHtml(book.author)}</p>
        <div class="tags-row">
          <span class="tag tag-cat">${escapeHtml(book.category)}</span>
          <span class="tag tag-era">${escapeHtml(book.category)}</span>
          <span class="tag tag-rating">
            <span class="stars"><i class="fa-solid fa-star"></i></span>
            ${safeRating} &nbsp;<span style="opacity:0.6;font-weight:400;">(${Math.floor(Math.random() * 5000 + 1000)} reviews)</span>
          </span>
        </div>
        <p class="desc-title">Description</p>
        <p class="desc-text">${escapeHtml(book.description)}</p>
        <div class="borrow-bar">
          <div class="avail-icon">
            <i class="fa-solid ${borrowIcon}"></i>
          </div>
          <div class="avail-text">
            <div class="avail-badge">
              <span class="avail-dot"></span>
              ${escapeHtml(availStatus)} <br>
              no. of available books is <i>${escapeHtml(String(book.availableCopies))}</i>
            </div>
            <div class="sub">Availability</div>
          </div>
          <button class="borrow-btn" ${book.availableCopies > 0 ? '' : 'disabled'}>
            <i class="fa-solid ${borrowIcon}"></i>
            ${escapeHtml(borrowLabel)}
          </button>
        </div>
      </div>
    `;

    const breadcrumbs = document.querySelector('.breadcrumb');
    if (breadcrumbs) {
      const categoryLink = breadcrumbs.querySelector('a:nth-child(3)');
      if (categoryLink) categoryLink.textContent = escapeHtml(book.category);
      const currentSpan = breadcrumbs.querySelector('.current');
      if (currentSpan) currentSpan.textContent = escapeHtml(book.title);
    }

    const allBooks = global.Library.getBooks();
    const moreBooks = allBooks.filter((b) => b.author === book.author && b.id !== book.id).slice(0, 2);
    const moreGrid = document.querySelector('.more-grid');
    if (moreGrid) {
      if (moreBooks.length > 0) {
        moreGrid.innerHTML = moreBooks
          .map(
            (b) => `
            <div class="more-card">
              <img src="${escapeHtml(resolveCover(b))}" alt="${escapeHtml(b.title)}" style="cursor: pointer;" onclick="window.location.href='books_details.html?id=${encodeURIComponent(
              b.id,
            )}'">
              <div class="mc-title">${escapeHtml(b.title)}</div>
              <div class="mc-year">By ${escapeHtml(b.author)}</div>
            </div>
          `,
          )
          .join('');
      } else {
        moreGrid.innerHTML = '<p>No other books by this author</p>';
      }
    }

    const wishlistBtn = document.querySelector('[data-card-action="wishlist"]');
    if (wishlistBtn && global.UserBookLists) {
      const inWishlist = global.UserBookLists.getIdsFor('wishlist').includes(bookId);
      wishlistBtn.classList.toggle('rail-btn--active', inWishlist);
      wishlistBtn.addEventListener('click', () => handleActionClick('wishlist', bookId, wishlistBtn));
    }

    const actionButtons = document.querySelectorAll('[data-card-action]');
    actionButtons.forEach((btn) => {
      const action = btn.dataset.cardAction;
      if (action && action !== 'wishlist') {
        btn.addEventListener('click', () => handleActionClick(action, bookId, btn));
      }
    });
  }

  function handleActionClick(action, bookId, btn) {
    if (!global.UserBookLists) return;

    const ACTION_LABELS = {
      wishlist: "Wishlist",
      favourites: "Favourites",
      "want-to-read": "Want to Read",
      "already-read": "Already Read",
      "currently-reading": "Currently Reading"
    };

    const label = ACTION_LABELS[action] || action;
    const inList = global.UserBookLists.getIdsFor(action).includes(bookId);

    if (typeof Swal === "undefined") {
      // Fallback if Swal is not available
      if (inList) {
        global.UserBookLists.removeFromList(action, bookId);
        btn.classList.remove('rail-btn--active');
      } else {
        global.UserBookLists.addBook(action, bookId);
        btn.classList.add('rail-btn--active');
      }
      return;
    }

    if (inList) {
      Swal.fire({
        returnFocus: false,
        scrollbarPadding: false,
        title: "Are you sure?",
        text: `Remove this book from ${label}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, remove it!",
      }).then((result) => {
        if (result.isConfirmed) {
          global.UserBookLists.removeFromList(action, bookId);
          btn.classList.remove('rail-btn--active');
          Swal.fire({
            returnFocus: false,
            scrollbarPadding: false,
            icon: "success",
            title: `Removed from ${label}`,
            text: "The book was removed from your list.",
          });
        }
      });
    } else {
      const result = global.UserBookLists.addBook(action, bookId);
      if (!result.ok && result.reason === "not-found") {
        Swal.fire({
          returnFocus: false,
          scrollbarPadding: false,
          icon: "error",
          title: "Book not in library",
          text: "It may have been removed. Refresh and try again.",
        });
      } else if (result.duplicate) {
        Swal.fire({
          returnFocus: false,
          scrollbarPadding: false,
          icon: "info",
          title: `Already in ${label}`,
          text: "This title was already on that list.",
        }).then(() => {
          btn.classList.add('rail-btn--active');
        });
      } else {
        btn.classList.add('rail-btn--active');
        Swal.fire({
          returnFocus: false,
          scrollbarPadding: false,
          title: `Added to ${label}`,
          text: "Saved to your lists in this browser.",
          icon: "success",
        });
      }
    }
  }

  // Load on page ready
  loadBookDetails();
})(window);
