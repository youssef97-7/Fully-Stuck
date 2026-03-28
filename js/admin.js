(function () {
  if (typeof Swal !== "undefined" && typeof Swal.mixin === "function") {
    Swal.mixin({ scrollbarPadding: false });
  }

  const tbody = document.getElementById("booksTbody");
  const resultsText = document.getElementById("resultsText");
  const addBookBtn = document.getElementById("addBookBtn");

  const modal = document.getElementById("bookModal");
  const modalTitle = document.getElementById("modalTitle");
  const submitBtn = document.getElementById("submitBtn");

  const closeModalBtn = document.getElementById("closeModalBtn");
  const cancelBtn = document.getElementById("cancelBtn");

  const form = document.getElementById("bookForm");
  const bookIdInput = document.getElementById("bookId");

  let formMode = "add";

  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function openBookModal(mode, book) {
    formMode = mode;

    if (formMode === "add") {
      modalTitle.textContent = "Add Book";
      submitBtn.textContent = "Add";
      form.reset();
      bookIdInput.value = "";
    } else {
      modalTitle.textContent = "Edit Book";
      submitBtn.textContent = "Save";

      bookIdInput.value = book.id;
      form.title.value = book.title || "";
      form.author.value = book.author || "";
      form.coverpage.value = book.coverpage || "";
      form.category.value = book.category || "";
      form.rating.value = book.rating ?? 0;
      form.description.value = book.description || "";
    }

    modal.classList.add("is-open");
    form.title.focus();
  }

  function closeBookModal() {
    modal.classList.remove("is-open");
  }

  function renderEmptyState() {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="empty-row">
          No books yet. Click “Add New Book”.
        </td>
      </tr>
    `;
  }

  function renderTable() {
    const books = window.Library.getBooks();
    resultsText.textContent = `Showing ${books.length} book${books.length === 1 ? "" : "s"}`;

    if (books.length === 0) {
      renderEmptyState();
      return;
    }

    tbody.innerHTML = books
      .map((b) => {
        const desc = b.description || "";
        const shortDesc = desc.length > 60 ? desc.slice(0, 60) + "…" : desc;

        return `
        <tr>
          <td>${escapeHtml(b.id)}</td>

          <td>
            <div class="book-details">
              <img class="book-cover" src="${escapeHtml(b.coverpage)}" alt="">
              <div class="book-text">
                <p class="book-title">${escapeHtml(b.title)}</p>
                <p class="book-desc">${escapeHtml(shortDesc)}</p>
              </div>
            </div>
          </td>

          <td>${escapeHtml(b.author)}</td>

          <td>
            <span class="category-tag">${escapeHtml(b.category)}</span>
            
          </td>
          <td>
            <span class="category-tag">${escapeHtml(String(b.rating ?? 0))} <i class="fa-solid fa-star star-rating"></i></span>
          </td>

          <td>
            <div class="actions">
              <button class="action-btn" type="button" data-action="edit" data-id="${escapeHtml(b.id)}">
                <i class="fa-regular fa-pen-to-square"></i>
              </button>

              <button class="action-btn" type="button" data-action="delete" data-id="${escapeHtml(b.id)}">
                <i class="fa-regular fa-trash-can"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
      })
      .join("");
  }

  addBookBtn.addEventListener("click", () => openBookModal("add"));

  closeModalBtn.addEventListener("click", closeBookModal);
  cancelBtn.addEventListener("click", closeBookModal);

  modal.addEventListener("click", (e) => {
    if (e.target && e.target.dataset && e.target.dataset.closeModal === "true") {
      closeBookModal();
    }
  });

  tbody.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;

    const bookId = btn.dataset.id;

    if (btn.dataset.action === "edit") {
      const book = window.Library.findBookById(bookId);
      if (!book) return;
      openBookModal("edit", book);
    }

    if (btn.dataset.action === "delete") {
      const book = window.Library.findBookById(bookId);
      if (!book) return;

      if (typeof Swal === "undefined") {
        const ok = confirm(`Delete "${book.title}"?`);
        if (!ok) return;
        window.Library.deleteBook(bookId);
        renderTable();
        return;
      }

      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          window.Library.deleteBook(bookId);
          renderTable();
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
          });
        }
      });
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = {
      title: form.title.value,
      author: form.author.value,
      coverpage: form.coverpage.value,
      category: form.category.value,
      rating: form.rating.value,
      description: form.description.value,
    };

    if (formMode === "add") {
      window.Library.addBook(formData);
    } else {
      window.Library.updateBook(bookIdInput.value, formData);
    }

    renderTable();
    closeBookModal();
  });

  renderTable();
})();