// public/login.js
/* ===================== CONSTANTS & CONFIG ===================== */
const API_BASE = "/api";

/* ===================== CLOCK ===================== */
function tickClock() {
  const now = new Date();
  document.getElementById("clockDate").textContent = now.toLocaleDateString(
    "en-GB",
    {
      weekday: "long",
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  );
  document.getElementById("clockTime").textContent =
    now.toLocaleTimeString("en-GB");
}

/* ===================== TOAST ===================== */
function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove("show"), 2600);
}

/* ===================== ERROR DISPLAY ===================== */
function showLoginError(msg) {
  const el = document.getElementById("loginError");
  el.textContent = msg;
  el.classList.add("show");
}

function clearLoginError() {
  const el = document.getElementById("loginError");
  el.textContent = "";
  el.classList.remove("show");
}

/* ===================== PASSWORD TOGGLE ===================== */
function togglePasswordVisibility() {
  const input = document.getElementById("fPassword");
  const btn = document.getElementById("pwToggleBtn");
  const isHidden = input.type === "password";
  input.type = isHidden ? "text" : "password";
  btn.textContent = isHidden ? "Hide" : "Show";
}

/* ===================== API FUNCTIONS ===================== */
async function loginRequest(email, password, remember) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, remember }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || "Invalid email or password.");
  }

  return await response.json();
}

/* ===================== FORM HANDLING ===================== */
async function handleLoginSubmit(e) {
  e.preventDefault();
  clearLoginError();

  const email = document.getElementById("fEmail").value.trim();
  const password = document.getElementById("fPassword").value;
  const remember = document.getElementById("fRemember").checked;

  if (!email || !password) {
    showLoginError("Please enter both email and password.");
    return;
  }

  const submitBtn = document.getElementById("loginSubmitBtn");
  submitBtn.disabled = true;
  submitBtn.textContent = "Signing In…";

  try {
    const result = await loginRequest(email, password, remember);
    showToast("Signed in. Redirecting…");
    window.location.href = result.redirectTo || "index.html";
  } catch (error) {
    showLoginError(error.message || "Failed to sign in. Please try again.");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Sign In";
  }
}

/* ===================== INITIALIZATION ===================== */
function init() {
  document
    .getElementById("loginForm")
    .addEventListener("submit", handleLoginSubmit);
  document
    .getElementById("pwToggleBtn")
    .addEventListener("click", togglePasswordVisibility);

  tickClock();
  setInterval(tickClock, 1000);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}