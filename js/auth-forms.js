(function () {
  /** All registered users (signup adds here). */
  const ACCOUNTS_KEY = "library.auth.accounts.v1";
  /** Last logged-in user (no password) — for profile / “who am I” on other pages. */
  const SESSION_KEY = "library.auth.currentUser";

  function getAccounts() {
    try {
      const raw = localStorage.getItem(ACCOUNTS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function saveAccounts(list) {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(list));
  }

  function saveSession(account) {
    const session = {
      email: account.email,
      firstName: account.firstName || "",
      lastName: account.lastName || "",
      phone: account.phone || "",
      birthDate: account.birthDate || "",
      role: account.role === "admin" ? "admin" : "user",
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRe = /^[0-9+\s()-]{10,20}$/;
  const nameRe = /^[a-zA-Z\u00C0-\u024F\s'-]{2,60}$/;

  function setFieldError(input, message) {
    if (!input) return;
    const wrap = input.closest(".auth-field");
    if (!wrap) return;
    let err = wrap.querySelector(".field-error");
    if (!err) {
      err = document.createElement("span");
      err.className = "field-error";
      err.setAttribute("role", "alert");
      wrap.appendChild(err);
    }
    err.textContent = message;
    wrap.classList.add("auth-field--invalid");
    input.setAttribute("aria-invalid", "true");
  }

  function clearErrors(form) {
    form.querySelectorAll(".auth-field--invalid").forEach((w) => {
      w.classList.remove("auth-field--invalid");
      const e = w.querySelector(".field-error");
      if (e) e.textContent = "";
    });
    form.querySelectorAll("[aria-invalid='true']").forEach((el) => {
      el.removeAttribute("aria-invalid");
    });
  }

  function swalBase() {
    return { scrollbarPadding: false, returnFocus: false };
  }

  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      clearErrors(loginForm);

      const email = loginForm.email.value.trim();
      const password = loginForm.password.value;
      let ok = true;

      if (!email) {
        setFieldError(loginForm.email, "Email is required.");
        ok = false;
      } else if (!emailRe.test(email)) {
        setFieldError(loginForm.email, "Enter a valid email address.");
        ok = false;
      }

      if (!password) {
        setFieldError(loginForm.password, "Password is required.");
        ok = false;
      } else if (password.length < 8) {
        setFieldError(loginForm.password, "Password must be at least 8 characters.");
        ok = false;
      }

      if (!ok) return;

      const accounts = getAccounts();
      const account = accounts.find((a) => a.email.toLowerCase() === email.toLowerCase());

      if (!account || account.password !== password) {
        localStorage.removeItem(SESSION_KEY);
        if (typeof Swal !== "undefined") {
          Swal.fire({
            ...swalBase(),
            icon: "error",
            title: "Login failed",
            text: "Email or password is incorrect. Sign up first if you are new.",
          });
        }
        return;
      }

      saveSession(account);

      const isAdmin = String(account.role || "user").toLowerCase() === "admin";
      const destination = isAdmin ? "admin/admin-dashboard.html" : "user/user.html";

      if (typeof Swal !== "undefined") {
        Swal.fire({
          ...swalBase(),
          icon: "success",
          title: "Welcome back",
          text: `Signed in as ${account.firstName || account.email}`,
          timer: 1600,
          showConfirmButton: false,
        }).then(() => {
          window.location.href = destination;
        });
      } else {
        window.location.href = destination;
      }
    });
  }

  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    const pwd = signupForm.querySelector("#signupPassword");
    const confirmPwd = signupForm.querySelector("#signupConfirmPassword");

    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      clearErrors(signupForm);

      const firstName = signupForm.firstName.value.trim();
      const lastName = signupForm.lastName.value.trim();
      const email = signupForm.email.value.trim();
      const phone = signupForm.phone.value.trim();
      const birthDate = signupForm.birthDate.value;
      const role = signupForm.querySelector('input[name="role"]:checked')?.value || "user";
      const password = pwd.value;
      const confirmPassword = confirmPwd.value;

      let ok = true;

      if (!firstName) {
        setFieldError(signupForm.firstName, "First name is required.");
        ok = false;
      } else if (!nameRe.test(firstName)) {
        setFieldError(signupForm.firstName, "Use 2–60 letters, spaces, or hyphens.");
        ok = false;
      }

      if (!lastName) {
        setFieldError(signupForm.lastName, "Last name is required.");
        ok = false;
      } else if (!nameRe.test(lastName)) {
        setFieldError(signupForm.lastName, "Use 2–60 letters, spaces, or hyphens.");
        ok = false;
      }

      if (!email) {
        setFieldError(signupForm.email, "Email is required.");
        ok = false;
      } else if (!emailRe.test(email)) {
        setFieldError(signupForm.email, "Enter a valid email address.");
        ok = false;
      }

      if (!phone) {
        setFieldError(signupForm.phone, "Phone number is required.");
        ok = false;
      } else if (!phoneRe.test(phone)) {
        setFieldError(signupForm.phone, "Enter 10–20 digits (spaces or + allowed).");
        ok = false;
      }

      if (!birthDate) {
        setFieldError(signupForm.birthDate, "Birth date is required.");
        ok = false;
      } else {
        const d = new Date(birthDate + "T12:00:00");
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        if (d > today) {
          setFieldError(signupForm.birthDate, "Birth date cannot be in the future.");
          ok = false;
        } else {
          const age = (Date.now() - d.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
          if (age < 5) {
            setFieldError(signupForm.birthDate, "You must be at least 5 years old.");
            ok = false;
          }
        }
      }

      if (!password) {
        setFieldError(pwd, "Password is required.");
        ok = false;
      } else if (password.length < 8) {
        setFieldError(pwd, "At least 8 characters.");
        ok = false;
      } else if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
        setFieldError(pwd, "Include at least one letter and one number.");
        ok = false;
      }

      if (!confirmPassword) {
        setFieldError(confirmPwd, "Confirm your password.");
        ok = false;
      } else if (confirmPassword !== password) {
        setFieldError(confirmPwd, "Passwords do not match.");
        ok = false;
      }

      if (!ok) return;

      const accounts = getAccounts();
      if (accounts.some((a) => a.email.toLowerCase() === email.toLowerCase())) {
        setFieldError(signupForm.email, "This email is already registered.");
        return;
      }

      const newAccount = {
        email,
        password,
        firstName,
        lastName,
        phone,
        birthDate,
        role: role === "admin" ? "admin" : "user",
        registeredAt: new Date().toISOString(),
      };
      accounts.push(newAccount);
      saveAccounts(accounts);

      if (typeof Swal !== "undefined") {
        Swal.fire({
          ...swalBase(),
          icon: "success",
          title: "Account created",
          text: "You can log in now.",
          confirmButtonText: "Go to login",
        }).then((r) => {
          if (r.isConfirmed) window.location.href = "login.html";
        });
      } else {
        window.location.href = "login.html";
      }
    });
  }
})();
