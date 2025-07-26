import { fetchCats } from "./explore/fetch-cats.js";
import { applyFilters } from "./explore/filters.js";
import { fetchCatDetails } from "./explore/cat-details.js";
import { getUser, checkIsAdmin } from "./auth/auth-utils.js";
import { galleryImages } from "./utils/gallery.js";

// -----------------------------
// DOM Ready
// -----------------------------
document.addEventListener("DOMContentLoaded", async () => {
  const user = getUser();
  const isAdmin = await checkIsAdmin();
  const currentPath = window.location.pathname;

  // Protected Routes Handling
  const loginPages = ["/pages/login.html", "/pages/sign-up.html"];
  const profilePages = ["/pages/profile.html", "/pages/cat-details.html"];
  const dashboardPages = ["/pages/dashboard.html"];

  if (user && loginPages.includes(currentPath)) {
    showToast("Already Logged In", "info");
    window.location = "/";
  }

  if (!user && profilePages.includes(currentPath)) {
    showToast("Please Login First", "warning");
    window.location = "/pages/login.html";
  }

  if (
    !user &&
    (profilePages.includes(currentPath) || dashboardPages.includes(currentPath))
  ) {
    showToast("Please Login First", "warning");
    window.location = "/pages/login.html";
  }

  if (user && dashboardPages.includes(currentPath) && !isAdmin) {
    showToast("You are not an admin", "warning");
    window.location = "/";
  }

  const showActiveSection = () => {
    const sections = document.querySelectorAll("#app > div");

    let hash = window.location.hash;
  
    // Set default hash
    if (!hash) {
      const path = window.location.pathname;
      
      if (path.endsWith("/pages/dashboard.html")) {
        hash = "#dashboard";
      } else {
        hash = "#home";
      }
    }

    sections.forEach((section) => {
      section.style.display = `#${section.id}` === hash ? "block" : "none";
    });
  };

  showActiveSection();
  window.addEventListener("hashchange", showActiveSection);

  // Initial Cat Data
  fetchCats();
  fetchCatDetails();
  galleryImages();

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
