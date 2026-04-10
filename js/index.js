const btn = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme');
const login_bakground = document.getElementById('login-page') || document.getElementById('signup-page');
const light_login_back = "url('images/lib_img.jpg')";
const dark_login_back = "url('images/dark_iib_img.jpg')";
const home_button = document.getElementById("home-button");
const skipHomeButtonColor = home_button && home_button.closest(".auth-card");

if (home_button) {
  home_button.style.transition = "0.5s";
}

if (currentTheme == 'dark') {
  document.body.classList.add('dark-mode');
  if (btn) btn.innerHTML = '<i class="fa-solid fa-sun"></i>';


  if (login_bakground) login_bakground.style.backgroundImage = dark_login_back;
  if (home_button && !skipHomeButtonColor) home_button.style.color = "white";
} else {
  document.body.classList.remove('dark-mode');
  if (btn) btn.innerHTML = '<i class="fa-solid fa-moon"></i>';

  if (login_bakground) login_bakground.style.backgroundImage = light_login_back;
  if (home_button && !skipHomeButtonColor) home_button.style.color = "black";
}

if (btn) {
  btn.addEventListener('click', function () {
    document.body.classList.toggle('dark-mode');

    if (document.body.classList.contains('dark-mode')) {
      btn.innerHTML = '<i class="fa-solid fa-sun"></i>';
      localStorage.setItem('theme', 'dark');

      if (login_bakground) login_bakground.style.backgroundImage = dark_login_back;
      if (home_button && !skipHomeButtonColor) home_button.style.color = "white";
    }
    else {
      btn.innerHTML = '<i class="fa-solid fa-moon"></i>';
      localStorage.setItem('theme', 'light');
      if (login_bakground) login_bakground.style.backgroundImage = light_login_back;
      if (home_button && !skipHomeButtonColor) home_button.style.color = "black";
    }
  });
}



///////// home ////////

const categories = [
  { title: "Fiction", count: "850k+", icon: "📚" },
  { title: "Science", count: "420k+", icon: "🧪" },
  { title: "History", count: "310k+", icon: "📜" },
  { title: "Tech", count: "250k+", icon: "💻" },
  { title: "Philosophy", count: "180k+", icon: "🧠" },
  { title: "Arts", count: "150k+", icon: "🎨" }
];

const container = document.getElementById('category-container');

if (container) {
  categories.forEach(item => {
    const card = document.createElement('div');
    card.className = 'category-card';

    card.innerHTML = `
      <div class="icon">${item.icon}</div>
      <h3>${item.title}</h3>
      <p>${item.count} titles</p>
    `;

    container.appendChild(card);
  });
}

// ===== USER PROFILE (fetch + edit modal) =====
(function () {
  const path = window.location.pathname.toLowerCase();
  const isUserArea = /\/user\/.+\.html$/.test(path);
  if (!isUserArea) return;

  const SESSION_KEY = "library.auth.currentUser";
  const ACCOUNTS_KEY = "library.auth.accounts.v1";
  const PREFS_KEY = "library.user.preferences.v1";
  const PROFILE_PHOTOS_KEY = "library.user.profilePhotos.v1";

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRe = /^[0-9+\s()-]{10,20}$/;
  const nameRe = /^[a-zA-Z\u00C0-\u024F\s'-]{2,60}$/;

  function getSessionUser() {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function getAccounts() {
    try {
      const raw = localStorage.getItem(ACCOUNTS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function saveAccounts(accounts) {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  }

  function getProfilePhotos() {
    try {
      const raw = localStorage.getItem(PROFILE_PHOTOS_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  function saveProfilePhoto(email, photoDataUrl) {
    try {
      const allPhotos = getProfilePhotos();
      allPhotos[email.toLowerCase()] = photoDataUrl;
      localStorage.setItem(PROFILE_PHOTOS_KEY, JSON.stringify(allPhotos));
    } catch {
      // ignore storage issues
    }
  }

  function removeProfilePhoto(email) {
    try {
      const allPhotos = getProfilePhotos();
      delete allPhotos[email.toLowerCase()];
      localStorage.setItem(PROFILE_PHOTOS_KEY, JSON.stringify(allPhotos));
    } catch {
      // ignore storage issues
    }
  }

  function getProfilePhoto(email) {
    const byEmail = getProfilePhotos()[email.toLowerCase()];
    if (byEmail) return byEmail;
    const account = getAccounts().find((item) => String(item.email || "").toLowerCase() === email.toLowerCase());
    return account?.profilePhoto || "";
  }

  function getPreferences(email) {
    try {
      const raw = localStorage.getItem(PREFS_KEY);
      const allPrefs = raw ? JSON.parse(raw) : {};
      return allPrefs[email.toLowerCase()] || {};
    } catch {
      return {};
    }
  }

  function savePreferences(email, prefs) {
    try {
      const raw = localStorage.getItem(PREFS_KEY);
      const allPrefs = raw ? JSON.parse(raw) : {};
      allPrefs[email.toLowerCase()] = prefs;
      localStorage.setItem(PREFS_KEY, JSON.stringify(allPrefs));
    } catch {
      // ignore storage issues
    }
  }

  function removePreferences(email) {
    try {
      const raw = localStorage.getItem(PREFS_KEY);
      const allPrefs = raw ? JSON.parse(raw) : {};
      delete allPrefs[email.toLowerCase()];
      localStorage.setItem(PREFS_KEY, JSON.stringify(allPrefs));
    } catch {
      // ignore storage issues
    }
  }

  function formatDate(dateStr) {
    if (!dateStr) return "Not set";
    const date = new Date(dateStr + "T12:00:00");
    if (Number.isNaN(date.getTime())) return "Not set";
    return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  }

  function escapeHtml(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  let currentUser = getSessionUser();
  if (!currentUser || !currentUser.email) {
    return;
  }

  const navList = document.querySelector("nav ul");
  if (!navList) return;

  const fullName = `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim() || "User";
  let currentProfilePhoto = getProfilePhoto(currentUser.email) || currentUser.profilePhoto || "";

  const navProfileItem = document.createElement("li");
  navProfileItem.className = "user-profile-nav-item";
  navProfileItem.innerHTML = `
    <button id="openUserProfileBtn" type="button" class="user-profile-nav-btn" aria-label="Open profile">
      <span class="user-profile-nav-avatar" aria-hidden="true">
        ${currentProfilePhoto ? `<img src="${escapeHtml(currentProfilePhoto)}" alt="" class="user-profile-avatar-img" />` : '<i class="fa-solid fa-user"></i>'}
      </span>
      <span class="user-profile-nav-name">${escapeHtml(fullName)}</span>
    </button>
  `;

  const themeToggleBtn = navList.querySelector("#theme-toggle");
  if (themeToggleBtn && themeToggleBtn.parentElement === navList) {
    navList.insertBefore(navProfileItem, themeToggleBtn);
  } else {
    navList.appendChild(navProfileItem);
  }

  const prefs = getPreferences(currentUser.email);
  const modalWrapper = document.createElement("div");
  modalWrapper.id = "userProfileModal";
  modalWrapper.className = "modal user-profile-modal";
  modalWrapper.innerHTML = `
    <div class="modal-backdrop" data-profile-close></div>
    <div class="modal-content user-profile-modal-content" role="dialog" aria-modal="true" aria-labelledby="userProfileModalTitle">
      <div class="modal-header">
        <h2 class="modal-title" id="userProfileModalTitle">User Profile</h2>
        <button type="button" class="icon-btn" data-profile-close aria-label="Close profile modal">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
      <div class="modal-body user-profile-modal-body">
        <div class="user-profile-summary">
          <div class="user-profile-summary-avatar" id="profileSummaryAvatar">
            ${currentProfilePhoto ? `<img src="${escapeHtml(currentProfilePhoto)}" alt="" class="user-profile-avatar-img user-profile-avatar-img--large" />` : '<i class="fa-solid fa-user"></i>'}
          </div>
          <div>
            <h3 id="profileDisplayName">${escapeHtml(fullName)}</h3>
            <p id="profileDisplayEmail">${escapeHtml(currentUser.email)}</p>
            <small>Member details are linked to your signed-in account.</small>
          </div>
        </div>
        <form id="userProfileForm" class="user-profile-form" novalidate>
          <div class="auth-field">
            <span class="auth-label">Profile photo</span>
            <div class="user-profile-photo-row">
              <input class="user-profile-file-input" type="file" name="profilePhotoFile" id="profilePhotoFile" accept="image/*" />
              <label for="profilePhotoFile" class="btn btn-primary user-profile-upload-btn">Add photo</label>
              <span class="user-profile-file-name" id="profilePhotoFileName">No file selected</span>
              <button type="button" class="btn" id="removeProfilePhotoBtn">Remove photo</button>
            </div>
            <small class="user-profile-photo-hint">Max size: 10MB. Image is auto-fitted to avatar size.</small>
            <span class="field-error" data-error-for="profilePhotoFile"></span>
          </div>
          <div class="auth-grid">
            <label class="auth-field">
              <span class="auth-label">First name</span>
              <input class="auth-input" type="text" name="firstName" value="${escapeHtml(currentUser.firstName || "")}" required />
              <span class="field-error" data-error-for="firstName"></span>
            </label>
            <label class="auth-field">
              <span class="auth-label">Last name</span>
              <input class="auth-input" type="text" name="lastName" value="${escapeHtml(currentUser.lastName || "")}" required />
              <span class="field-error" data-error-for="lastName"></span>
            </label>
            <label class="auth-field">
              <span class="auth-label">Email</span>
              <input class="auth-input" type="email" name="email" value="${escapeHtml(currentUser.email || "")}" required />
              <span class="field-error" data-error-for="email"></span>
            </label>
            <label class="auth-field">
              <span class="auth-label">Phone</span>
              <input class="auth-input" type="text" name="phone" value="${escapeHtml(currentUser.phone || "")}" required />
              <span class="field-error" data-error-for="phone"></span>
            </label>
            <label class="auth-field">
              <span class="auth-label">Birth date</span>
              <input class="auth-input" type="date" name="birthDate" value="${escapeHtml(currentUser.birthDate || "")}" required />
              <span class="field-error" data-error-for="birthDate"></span>
            </label>
            <label class="auth-field">
              <span class="auth-label">Account role</span>
              <input class="auth-input" type="text" value="${escapeHtml(currentUser.role || "user")}" readonly />
            </label>
          </div>
          <div class="user-profile-preferences">
            <h4>Preferences</h4>
            <div class="auth-grid">
              <label class="auth-field">
                <span class="auth-label">Theme preference</span>
                <select class="auth-input" name="themePreference">
                  <option value="follow-system" ${prefs.themePreference === "follow-system" ? "selected" : ""}>Follow current setting</option>
                  <option value="light" ${prefs.themePreference === "light" ? "selected" : ""}>Light</option>
                  <option value="dark" ${prefs.themePreference === "dark" ? "selected" : ""}>Dark</option>
                </select>
              </label>
              <div class="auth-field user-profile-checkbox">
                <span class="auth-label">Notifications</span>
                <label>
                  <input type="checkbox" name="notificationsEnabled" ${prefs.notificationsEnabled === false ? "" : "checked"} />
                  Email notifications enabled
                </label>
              </div>
            </div>
          </div>
          <p class="user-profile-meta">Date of birth: <strong id="profileBirthDateLabel">${formatDate(currentUser.birthDate)}</strong></p>
          <div class="modal-footer">
            <button type="button" class="btn" data-profile-close>Cancel</button>
            <button type="submit" class="btn btn-primary">Save profile</button>
          </div>
        </form>
      </div>
    </div>
  `;
  document.body.appendChild(modalWrapper);

  const openBtn = document.getElementById("openUserProfileBtn");
  const form = document.getElementById("userProfileForm");
  const birthDateLabel = document.getElementById("profileBirthDateLabel");
  const displayName = document.getElementById("profileDisplayName");
  const displayEmail = document.getElementById("profileDisplayEmail");
  const navName = navProfileItem.querySelector(".user-profile-nav-name");
  const navAvatar = navProfileItem.querySelector(".user-profile-nav-avatar");
  const summaryAvatar = document.getElementById("profileSummaryAvatar");
  const removeProfilePhotoBtn = document.getElementById("removeProfilePhotoBtn");
  const profilePhotoFileInput = document.getElementById("profilePhotoFile");
  const profilePhotoFileName = document.getElementById("profilePhotoFileName");
  const focusableSelectors = 'a[href], button:not([disabled]), textarea, input, select';
  let pendingProfilePhoto = currentProfilePhoto;

  function openModal() {
    modalWrapper.classList.add("is-open");
    document.body.classList.add("user-profile-modal-open");
    const firstInput = modalWrapper.querySelector("input[name='firstName']");
    if (firstInput) firstInput.focus();
  }

  function closeModal() {
    modalWrapper.classList.remove("is-open");
    document.body.classList.remove("user-profile-modal-open");
    if (openBtn) openBtn.focus();
  }

  function setFieldError(name, message) {
    const target = form.querySelector(`[data-error-for="${name}"]`);
    if (target) target.textContent = message;
  }

  function clearFieldErrors() {
    form.querySelectorAll(".field-error[data-error-for]").forEach((el) => {
      el.textContent = "";
    });
  }

  function renderAvatar(container, photo, large) {
    if (!container) return;
    if (photo) {
      container.innerHTML = `<img src="${escapeHtml(photo)}" alt="" class="user-profile-avatar-img ${large ? "user-profile-avatar-img--large" : ""}" />`;
    } else {
      container.innerHTML = '<i class="fa-solid fa-user"></i>';
    }
  }

  function resetPhotoFileName() {
    if (profilePhotoFileName) profilePhotoFileName.textContent = "No file selected";
  }

  function fileToAvatarDataUrl(file) {
    return new Promise((resolve, reject) => {
      const objectUrl = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const size = 256;
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          URL.revokeObjectURL(objectUrl);
          reject(new Error("Canvas not available"));
          return;
        }

        const srcW = img.naturalWidth;
        const srcH = img.naturalHeight;
        const side = Math.min(srcW, srcH);
        const sx = Math.floor((srcW - side) / 2);
        const sy = Math.floor((srcH - side) / 2);

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, sx, sy, side, side, 0, 0, size, size);
        URL.revokeObjectURL(objectUrl);
        resolve(canvas.toDataURL("image/jpeg", 0.9));
      };
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("Image decode failed"));
      };
      img.src = objectUrl;
    });
  }

  function applyThemePreference(pref) {
    if (pref === "dark") {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
      if (btn) btn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    } else if (pref === "light") {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
      if (btn) btn.innerHTML = '<i class="fa-solid fa-moon"></i>';
    }
  }

  function updateLocalSession(values, profilePhoto) {
    const nextSession = {
      email: values.email,
      firstName: values.firstName,
      lastName: values.lastName,
      phone: values.phone,
      birthDate: values.birthDate,
      profilePhoto: profilePhoto || "",
      role: currentUser.role === "admin" ? "admin" : "user",
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession));
  }

  if (openBtn) {
    openBtn.addEventListener("click", openModal);
  }

  if (removeProfilePhotoBtn) {
    removeProfilePhotoBtn.addEventListener("click", () => {
      pendingProfilePhoto = "";
      if (profilePhotoFileInput) profilePhotoFileInput.value = "";
      resetPhotoFileName();
      renderAvatar(navAvatar, "", false);
      renderAvatar(summaryAvatar, "", true);
    });
  }

  if (profilePhotoFileInput) {
    profilePhotoFileInput.addEventListener("change", async () => {
      clearFieldErrors();
      const file = profilePhotoFileInput.files && profilePhotoFileInput.files[0];
      if (!file) {
        resetPhotoFileName();
        return;
      }

      if (!file.type.startsWith("image/")) {
        setFieldError("profilePhotoFile", "Please choose an image file.");
        profilePhotoFileInput.value = "";
        resetPhotoFileName();
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setFieldError("profilePhotoFile", "Image must be 10MB or smaller.");
        profilePhotoFileInput.value = "";
        resetPhotoFileName();
        return;
      }

      if (profilePhotoFileName) profilePhotoFileName.textContent = file.name;

      try {
        pendingProfilePhoto = String(await fileToAvatarDataUrl(file));
        renderAvatar(navAvatar, pendingProfilePhoto, false);
        renderAvatar(summaryAvatar, pendingProfilePhoto, true);
      } catch {
        setFieldError("profilePhotoFile", "Could not read this image. Please try another one.");
        profilePhotoFileInput.value = "";
        resetPhotoFileName();
      }
    });
  }

  modalWrapper.addEventListener("click", (event) => {
    if (event.target && event.target.closest("[data-profile-close]")) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (!modalWrapper.classList.contains("is-open")) return;
    if (event.key === "Escape") {
      closeModal();
      return;
    }
    if (event.key === "Tab") {
      const focusable = Array.from(modalWrapper.querySelectorAll(focusableSelectors));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      clearFieldErrors();

      const formData = new FormData(form);
      const values = {
        firstName: String(formData.get("firstName") || "").trim(),
        lastName: String(formData.get("lastName") || "").trim(),
        email: String(formData.get("email") || "").trim(),
        phone: String(formData.get("phone") || "").trim(),
        birthDate: String(formData.get("birthDate") || "").trim(),
        themePreference: String(formData.get("themePreference") || "follow-system"),
        notificationsEnabled: formData.get("notificationsEnabled") === "on",
      };

      let valid = true;
      if (!nameRe.test(values.firstName)) {
        setFieldError("firstName", "Use 2–60 letters, spaces, or hyphens.");
        valid = false;
      }
      if (!nameRe.test(values.lastName)) {
        setFieldError("lastName", "Use 2–60 letters, spaces, or hyphens.");
        valid = false;
      }
      if (!emailRe.test(values.email)) {
        setFieldError("email", "Enter a valid email address.");
        valid = false;
      }
      if (!phoneRe.test(values.phone)) {
        setFieldError("phone", "Enter 10–20 digits (spaces or + allowed).");
        valid = false;
      }
      if (!values.birthDate) {
        setFieldError("birthDate", "Birth date is required.");
        valid = false;
      } else {
        const birth = new Date(values.birthDate + "T12:00:00");
        if (Number.isNaN(birth.getTime()) || birth > new Date()) {
          setFieldError("birthDate", "Birth date cannot be in the future.");
          valid = false;
        }
      }

      const accounts = getAccounts();
      const emailTaken = accounts.some(
        (account) =>
          String(account.email || "").toLowerCase() === values.email.toLowerCase() &&
          String(account.email || "").toLowerCase() !== String(currentUser.email || "").toLowerCase()
      );
      if (emailTaken) {
        setFieldError("email", "This email is already registered.");
        valid = false;
      }

      if (!valid) return;

      const currentEmail = String(currentUser.email || "").toLowerCase();
      const accountIndex = accounts.findIndex((account) => String(account.email || "").toLowerCase() === currentEmail);

      if (accountIndex >= 0) {
        accounts[accountIndex] = {
          ...accounts[accountIndex],
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phone: values.phone,
          birthDate: values.birthDate,
          profilePhoto: pendingProfilePhoto,
        };
        saveAccounts(accounts);
      }

      updateLocalSession(values, pendingProfilePhoto);
      if (values.email.toLowerCase() !== currentEmail) {
        removePreferences(currentUser.email);
        removeProfilePhoto(currentUser.email);
      }
      savePreferences(values.email, {
        themePreference: values.themePreference,
        notificationsEnabled: values.notificationsEnabled,
      });
      if (pendingProfilePhoto) {
        saveProfilePhoto(values.email, pendingProfilePhoto);
      } else {
        removeProfilePhoto(values.email);
      }
      applyThemePreference(values.themePreference);
      currentUser = {
        ...currentUser,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        birthDate: values.birthDate,
        profilePhoto: pendingProfilePhoto,
      };
      currentProfilePhoto = pendingProfilePhoto;

      const nextName = `${values.firstName} ${values.lastName}`.trim() || "User";
      if (displayName) displayName.textContent = nextName;
      if (displayEmail) displayEmail.textContent = values.email;
      if (navName) navName.textContent = nextName;
      if (birthDateLabel) birthDateLabel.textContent = formatDate(values.birthDate);
      renderAvatar(navAvatar, currentProfilePhoto, false);
      renderAvatar(summaryAvatar, currentProfilePhoto, true);

      if (typeof Swal !== "undefined") {
        Swal.fire({
          icon: "success",
          title: "Profile updated",
          text: "Your account details and preferences were saved.",
          timer: 1500,
          showConfirmButton: false,
          scrollbarPadding: false,
          returnFocus: false,
        });
      }

      closeModal();
    });
  }
})();

const bookDetailsButton = document.getElementsByClassName('book-img');
if (bookDetailsButton) {
  Array.from(bookDetailsButton).forEach(button => {
    button.addEventListener('click', () => {
      window.location.href = 'books_details.html';
    });
  });
}

// ===== BOOK DETAILS PAGE SCRIPTS =====

// Keep icon in sync with current theme on book pages too.
if (btn) {
  const icon = btn.querySelector('i');
  if (icon) {
    const dark = document.body.classList.contains('dark-mode');
    icon.className = dark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  }
}

// Borrow button feedback
const borrowBtn = document.querySelector('.borrow-btn');
if (borrowBtn) {
  borrowBtn.addEventListener('click', function () {
    this.innerHTML = '<i class="fa-solid fa-check"></i> Borrowed!';
    this.style.background = '#16a34a';
    this.disabled = true;
  });
}

// Make all images clickable to go to book details
const allImages = document.querySelectorAll('img');
allImages.forEach(img => {
  img.style.cursor = 'pointer';
  img.addEventListener('click', () => {
    window.location.href = 'books_details.html';
  });
});

const container1 = document.getElementById('category-container');

if (container) {
  categories.forEach(item => {
    const card = document.createElement('div');
    card.className = 'category-card';

    card.innerHTML = `
      <div class="icon">${item.icon}</div>
      <h3>${item.title}</h3>
      <p>${item.count} titles</p>
    `;

    container.appendChild(card);
  });
}