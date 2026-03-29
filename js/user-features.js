(function () {
  const page = document.body.dataset.userPage;
  if (!page || (page !== "want-to-read" && page !== "already-read" && page !== "favourites")) return;

  if (!window.Library || !window.LibraryBookUI || !window.UserBookLists) return;

  const { createLibraryBookCard, bindLibraryCardActions } = window.LibraryBookUI;

  let container;
  if (page === "want-to-read") {
    container = document.getElementById("wantToReadBooks");
  } else if (page === "already-read") {
    container = document.getElementById("alreadyReadBooks");
  } else if (page === "favourites ") {
    container = document.getElementById("favouritesBooks");
  }   

  if (!container) return;

  const action = page === "want-to-read" ? "want-to-read" : page === "already-read" ? "already-read" : "favourites";

  const emptyListHtml =
    page === "want-to-read"
      ? '<p class="user-list-empty" role="status">Your Want to Read list is empty. On <a href="user.html">Home</a>, hover a book and tap the <strong>+</strong> button to add it—including new titles added by an admin.</p>'
      : page === "already-read"
        ? '<p class="user-list-empty" role="status">No finished books yet. Mark titles as read from the card actions on <a href="user.html">Home</a> (check icon), or open Want to Read and move a book there first.</p>'
        : '<p class="user-list-empty" role="status">Your favourites list is empty. On <a href="user.html">Home</a>, hover a book and tap the <strong>heart</strong> button to save it here.</p>';

  function render() {
    const listBooks = window.UserBookLists.resolveBooks(action);

    if (!window.Library.getBooks().length) {
      container.innerHTML =
        '<p class="user-list-empty" role="status">No books in the library yet. Open <a href="user.html">Home</a> after an admin adds titles.</p>';
      return;
    }

    if (!listBooks.length) {
      container.innerHTML = emptyListHtml;
      return;
    }

    container.innerHTML = listBooks
      .map((book) => createLibraryBookCard(book, { listRemoveContext: action }))
      .join("");
  }

  bindLibraryCardActions(container, {
    listRemoveContext: action,
    onListChanged: render,
  });

  render();
})();
