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

  const LIST_REMOVE_LABELS = {
    "want-to-read": "Remove from Want to Read (list only)",
    "already-read": "Remove from Already Read (list only)",
  };

  const RAIL_ACTIONS = ["wishlist", "favourites", "want-to-read", "already-read"];

  function railActiveClass(bookIdRaw, action) {
    const id = String(bookIdRaw ?? "").trim();
    if (!id || !global.UserBookLists) return "";
    return global.UserBookLists.getIdsFor(action).includes(id) ? "rail-btn--active" : "";
  }

  /** Keep rail highlight in sync with localStorage (e.g. after add, or want↔already-read rules). */
  function syncRailActiveStates(card) {
    if (!card || !global.UserBookLists) return;
    const id = card.dataset.bookId;
    if (!id) return;
    const idStr = String(id);
    for (const action of RAIL_ACTIONS) {
      const btn = card.querySelector(`button[data-card-action="${action}"]`);
      if (!btn) continue;
      const onList = global.UserBookLists.getIdsFor(action).includes(idStr);
      btn.classList.toggle("rail-btn--active", onList);
    }
  }

  function createLibraryBookCard(book, options = {}) {
    const listRemoveContext =
      options.listRemoveContext === "want-to-read" || options.listRemoveContext === "already-read"
        ? options.listRemoveContext
        : null;

    const safeTitle = escapeHtml(book.title || "Untitled");
    const safeAuthor = escapeHtml(book.author || "Unknown author");
    const safeCover = escapeHtml(resolveCover(book));
    const safeCategory = escapeHtml(book.category || "General");
    const ratingValue = Number(book.rating);
    const safeRating = Number.isFinite(ratingValue)
      ? Math.max(0, Math.min(5, ratingValue)).toFixed(1)
      : "0.0";

    const safeId = escapeHtml(String(book.id ?? ""));
    const removeListAttr = listRemoveContext ? escapeHtml(listRemoveContext) : "";
    const removeLabel = listRemoveContext ? escapeHtml(LIST_REMOVE_LABELS[listRemoveContext] || "Remove from this list") : "";

    const removeRow = listRemoveContext
      ? `<li><button type="button" class="card-rail-remove" data-remove-from-list="${removeListAttr}" aria-label="${removeLabel}" title="${removeLabel}"><i class="fa-solid fa-trash-can" aria-hidden="true"></i></button></li>`
      : "";

    const rawId = book.id;
    const cWish = railActiveClass(rawId, "wishlist");
    const cFav = railActiveClass(rawId, "favourites");
    const cWtr = railActiveClass(rawId, "want-to-read");
    const cAr = railActiveClass(rawId, "already-read");

    return `
      <div class="book-card" data-book-id="${safeId}">
        <div class="book-card-media">
          <img src="${safeCover}" alt="${safeTitle}">
          <div class="main-card-hedden">
            <ul class="card-hedden">
              <li><button type="button" data-card-action="wishlist" class="${cWish}" title="Add to Wishlist" aria-label="Add to Wishlist"><i class="fa-solid fa-bookmark"></i></button></li>
              <li><button type="button" data-card-action="favourites" class="${cFav}" title="Add to Favourites" aria-label="Add to Favourites"><i class="fa-regular fa-heart"></i></button></li>
              <li><button type="button" data-card-action="want-to-read" class="${cWtr}" title="Add to Want to Read" aria-label="Add to Want to Read"><i class="fa-solid fa-plus"></i></button></li>
              <li><button type="button" data-card-action="already-read" class="${cAr}" title="Mark as Already Read" aria-label="Mark as Already Read"><i class="fa-solid fa-check"></i></button></li>
              ${removeRow}
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

  function bindLibraryCardActions(container, bindOptions = {}) {
    if (!container || container.dataset.libraryCardActionsBound === "1") return;
    container.dataset.libraryCardActionsBound = "1";

    const listRemoveContext =
      bindOptions.listRemoveContext === "want-to-read" || bindOptions.listRemoveContext === "already-read"
        ? bindOptions.listRemoveContext
        : null;
    const onListChanged = typeof bindOptions.onListChanged === "function" ? bindOptions.onListChanged : null;

    if (typeof Swal !== "undefined" && typeof Swal.mixin === "function") {
      Swal.mixin({ scrollbarPadding: false });
    }

    const userArea = isUserAreaPath();

    container.addEventListener("click", (e) => {
      const removeBtn = e.target.closest("[data-remove-from-list]");
      if (removeBtn && container.contains(removeBtn)) {
        const ctx = removeBtn.dataset.removeFromList;
        if (!listRemoveContext || ctx !== listRemoveContext) return;

        e.preventDefault();
        if (!userArea) return;

        const card = removeBtn.closest(".book-card");
        removeBtn.blur();
        if (document.activeElement && card && card.contains(document.activeElement)) {
          document.activeElement.blur();
        }
        card?.classList.add("book-card--rail-reset");

        const bookId = card?.dataset.bookId;
        if (!bookId) {
          card?.classList.remove("book-card--rail-reset");
          return;
        }

        const clearRailReset = () => card?.classList.remove("book-card--rail-reset");
        const finish = () => {
          clearRailReset();
          onListChanged?.();
        };

        if (typeof Swal === "undefined") {
          finish();
          return;
        }

        Swal.fire({
          returnFocus: false,
          scrollbarPadding: false,
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!",
        }).then((result) => {
          if (!result.isConfirmed) {
            clearRailReset();
            return;
          }
          if (global.UserBookLists) {
            global.UserBookLists.removeFromList(ctx, bookId);
          }
          Swal.fire({
            returnFocus: false,
            scrollbarPadding: false,
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
          }).finally(finish);
        });
        return;
      }

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
        const inList = global.UserBookLists.getIdsFor(action).includes(bookId);
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
              Swal.fire({
                returnFocus: false,
                scrollbarPadding: false,
                icon: "success",
                title: `Removed from ${label}`,
                text: "The book was removed from your list.",
              }).finally(() => {
                syncRailActiveStates(card);
                clearRailReset();
                onListChanged?.();
              });
            } else {
              clearRailReset();
            }
          });
          return;
        }

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
          }).finally(() => {
            syncRailActiveStates(card);
            clearRailReset();
          });
          return;
        }
      }

      const afterAdd = () => {
        syncRailActiveStates(card);
        clearRailReset();
      };

      Swal.fire({
        ...swalBase,
        title: `Added to ${label}`,
        text: "Saved to your lists in this browser.",
        icon: "success",
      }).finally(afterAdd);
    });
  }

  global.LibraryBookUI = {
    createLibraryBookCard,
    bindLibraryCardActions,
    syncRailActiveStates,
  };
})(window);
