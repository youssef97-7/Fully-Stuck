(function () {
  const page = document.body.dataset.userPage;
  if (!page || (page !== "want-to-read" && page !== "already-read")) return;

  if (!window.Library || !window.LibraryBookUI || !window.UserBookLists) return;

  const { createLibraryBookCard, bindLibraryCardActions } = window.LibraryBookUI;

  const container =
    page === "want-to-read"
      ? document.getElementById("wantToReadBooks")
      : document.getElementById("alreadyReadBooks");

  if (!container) return;

  bindLibraryCardActions(container);

  const action = page === "want-to-read" ? "want-to-read" : "already-read";
  const listBooks = window.UserBookLists.resolveBooks(action);

  const emptyListHtml =
    page === "want-to-read"
      ? '<p class="user-list-empty" role="status">Your Want to Read list is empty. On <a href="user.html">Home</a>, hover a book and tap the <strong>+</strong> button to add it—including new titles added by an admin.</p>'
      : '<p class="user-list-empty" role="status">No finished books yet. Mark titles as read from the card actions on <a href="user.html">Home</a> (check icon), or open Want to Read and move a book there first.</p>';

  if (!window.Library.getBooks().length) {
    container.innerHTML =
      '<p class="user-list-empty" role="status">No books in the library yet. Open <a href="user.html">Home</a> after an admin adds titles.</p>';
    return;
  }

  if (!listBooks.length) {
    container.innerHTML = emptyListHtml;
    return;
  }

  container.innerHTML = listBooks.map(createLibraryBookCard).join("");
})();
