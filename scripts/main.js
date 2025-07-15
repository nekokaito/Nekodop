import { fetchCats } from "./explore/fetch-cats.js";
import { applyFilters } from "./explore/filters.js";
import { fetchCatDetails } from "./explore/cat-details.js";

// -----------------------------
// DOM Ready
// -----------------------------
document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const currentPath = window.location.pathname;

  // Protected Routes Handling
  const loginPages = ["/pages/login.html", "/pages/sign-up.html"];
  const profilePages = ["/pages/profile.html", "/pages/cat-details.html"];

  if (user && loginPages.includes(currentPath)) {
    console.log("Already Has Been Logged In");
    window.location = "/";
  }

  if (!user && profilePages.includes(currentPath)) {
    console.log("Please Login First");
    window.location = "/pages/login.html";
  }

  // Section Routing via Hash
  const showActiveSection = () => {
    const sections = document.querySelectorAll("#app > div");
    const hash = window.location.hash || "#home";

    sections.forEach((section) => {
      section.style.display = `#${section.id}` === hash ? "block" : "none";
    });
  };

  showActiveSection();
  window.addEventListener("hashchange", showActiveSection);

  // Initial Cat Data
  fetchCats();
  fetchCatDetails();

  // Filter Events
  const searchInput = document.getElementById("search-input");
  const maleCheckbox = document.getElementById("male-filter");
  const femaleCheckbox = document.getElementById("female-filter");

  if (searchInput) searchInput.addEventListener("input", applyFilters);
  if (maleCheckbox) maleCheckbox.addEventListener("change", applyFilters);
  if (femaleCheckbox) femaleCheckbox.addEventListener("change", applyFilters);
});

// -----------------------------
// Page Preloader
// -----------------------------
window.onload = function () {
  const preloader = document.getElementById("preloader");
  const app = document.getElementById("main-content");
  const footer = document.getElementById("footer-content");

  preloader.style.display = "flex";
  app.style.display = "none";
  footer.style.display = "none";

  setTimeout(() => {
    preloader.style.display = "none";
    app.style.display = "block";
    footer.style.display = "block";
  }, 2000);
};
