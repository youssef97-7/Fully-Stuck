/**
 * Per-browser user lists (wishlist, favourites, want to read, already read).
 * Stores book ids; books are resolved from Library so admin-added titles stay in sync.
 */
(function (global) {
  const KEYS = {
    wishlist: "user.wishlist.v1",
    favourites: "user.favourites.v1",
    "want-to-read": "user.wantToRead.v1",
    "already-read": "user.alreadyRead.v1",
    "currently-reading": "user.currentlyReading.v1",
  };

  function readIds(key) {
    try {
      const raw = global.localStorage.getItem(key);
      const arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr.map(String) : [];
    } catch {
      return [];
    }
  }

  function writeIds(key, ids) {
    global.localStorage.setItem(key, JSON.stringify(ids));
  }

  function removeIdFromList(action, bookId) {
    const key = KEYS[action];
    if (!key) return;
    const id = String(bookId);
    const next = readIds(key).filter((x) => x !== id);
    writeIds(key, next);
  }

  /**
   * @param {'wishlist'|'favourites'|'want-to-read'|'already-read'|'currently-reading'} action
   * @param {string} bookId
   * @returns {{ ok: boolean, duplicate?: boolean, reason?: string }}
   */
  function addBook(action, bookId) {
    const key = KEYS[action];
    if (!key || bookId == null || String(bookId).trim() === "") {
      return { ok: false, reason: "bad-args" };
    }
    const id = String(bookId);
    if (!global.Library || !global.Library.findBookById(id)) {
      return { ok: false, reason: "not-found" };
    }

    if (action === "already-read") {
      removeIdFromList("want-to-read", id);
    }

    const ids = readIds(key);
    if (ids.includes(id)) return { ok: true, duplicate: true };

    ids.push(id);
    writeIds(key, ids);
    return { ok: true, duplicate: false };
  }

  function getIdsFor(action) {
    const key = KEYS[action];
    return key ? readIds(key) : [];
  }

  function resolveBooks(action) {
    if (!global.Library) return [];
    const ids = getIdsFor(action);
    const all = global.Library.getBooks();
    return ids
      .map((id) => all.find((b) => String(b.id) === String(id)))
      .filter(Boolean);
  }

  /**
   * Remove a book id from one list only (does not touch Library or other lists).
   * @param {'wishlist'|'favourites'|'want-to-read'|'already-read'|'currently-reading'} action
   */
  function removeFromList(action, bookId) {
    const key = KEYS[action];
    if (!key || bookId == null || String(bookId).trim() === "") return { ok: false };
    removeIdFromList(action, bookId);
    return { ok: true };
  }

  global.UserBookLists = {
    addBook,
    removeFromList,
    getIdsFor,
    resolveBooks,
  };
})(window);
