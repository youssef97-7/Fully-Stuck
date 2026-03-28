/**
 * Shared featured-book card markup + action buttons (same behavior on index, user home, and list pages).
 */
(function (global) {
  function isUserAreaPath() {
    return /\/user(\/|$)/i.test(global.location.pathname);
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
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

  const ACTION_LABELS = {
    wishlist: "Wishlist",
    favourites: "Favourites",
    "want-to-read": "Want to Read",
    "already-read": "Already Read",
  };

  function createLibraryBookCard(book) {
    const safeTitle = escapeHtml(book.title || "Untitled");
    const safeAuthor = escapeHtml(book.author || "Unknown author");
    const safeCover = escapeHtml(resolveCover(book));
    const safeCategory = escapeHtml(book.category || "General");
    const ratingValue = Number(book.rating);
    const safeRating = Number.isFinite(ratingValue)
      ? Math.max(0, Math.min(5, ratingValue)).toFixed(1)
      : "0.0";

    const safeId = escapeHtml(String(book.id ?? ""));

    return `
      <div class="book-card" data-book-id="${safeId}">
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

  function bindLibraryCardActions(container) {
    if (!container || container.dataset.libraryCardActionsBound === "1") return;
    container.dataset.libraryCardActionsBound = "1";

    if (typeof Swal !== "undefined" && typeof Swal.mixin === "function") {
      Swal.mixin({ scrollbarPadding: false });
    }

    const userArea = isUserAreaPath();

    container.addEventListener("click", (e) => {
      const actionBtn = e.target.closest("[data-card-action]");
      if (!actionBtn || !container.contains(actionBtn)) return;

      const action = actionBtn.dataset.cardAction;
      const label = ACTION_LABELS[action];
      if (!label) return;

      e.preventDefault();
      if (typeof Swal === "undefined") return;

      const card = actionBtn.closest(".book-card");
      actionBtn.blur();
      if (document.activeElement && card && card.contains(document.activeElement)) {
        document.activeElement.blur();
      }
      card?.classList.add("book-card--rail-reset");

      const swalBase = {
        returnFocus: false,
        scrollbarPadding: false,
      };

      const clearRailReset = () => card?.classList.remove("book-card--rail-reset");

      if (!userArea) {
        Swal.fire({
          ...swalBase,
          icon: "error",
          title: "Oops...\nplease login first",
          text: "Something went wrong!",
        }).finally(clearRailReset);
        return;
      }

      const bookId = card?.dataset.bookId;
      if (!bookId) {
        Swal.fire({
          ...swalBase,
          icon: "error",
          title: "Missing book id",
          text: "This card cannot be saved. Try refreshing the page.",
        }).finally(clearRailReset);
        return;
      }

      if (global.UserBookLists) {
        const result = global.UserBookLists.addBook(action, bookId);
        if (!result.ok && result.reason === "not-found") {
          Swal.fire({
            ...swalBase,
            icon: "error",
            title: "Book not in library",
            text: "It may have been removed. Refresh and try again.",
          }).finally(clearRailReset);
          return;
        }
        if (result.duplicate) {
          Swal.fire({
            ...swalBase,
            icon: "info",
            title: `Already in ${label}`,
            text: "This title was already on that list.",
          }).finally(clearRailReset);
          return;
        }
      }

      Swal.fire({
        ...swalBase,
        title: `Added to ${label}`,
        text: "Saved to your lists in this browser.",
        icon: "success",
      }).finally(clearRailReset);
    });
  }

  global.LibraryBookUI = {
    createLibraryBookCard,
    bindLibraryCardActions,
  };
})(window);
