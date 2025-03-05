document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const currentPath = window.location.pathname;

  const loginPages = ["/pages/login.html", "/pages/sign-up.html"];
  const profilePages = ["/pages/profile.html"];

  // Protected Routes
  if (user && loginPages.includes(currentPath)) {
    window.location = "/";
    console.log("Already Has Been Logged In");
  }
  if (!user && profilePages.includes(currentPath)) {
    window.location = "/pages/login.html";
    console.log("Please Login First");
  }

  const showActiveSection = () => {
    const sections = document.querySelectorAll("#app > div");
    const hash = window.location.hash || "#home";

    sections.forEach((section) => {
      section.style.display = `#${section.id}` === hash ? "block" : "none";
    });
  };

  showActiveSection();
  window.addEventListener("hashchange", showActiveSection);
});

window.onload = function () {
  // Get the preloader element
  const preloader = document.getElementById("preloader");
  const app = document.getElementById("main-content");

 //Show the display of the preloader
  preloader.style.display = "flex";
  app.style.display = "none";

  setTimeout(function () {
    preloader.style.display = "none";
    app.style.display = "block";
  }, 2000);
};
