document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const currentPath = window.location.pathname;

  const loginPages = ["/pages/login.html", "/pages/sign-up.html"];

  // Protected Routes
  if (user && loginPages.includes(currentPath)) {
    window.location = "/";
    console.log("Already Has Been Logged In");
  }

  const showActiveSection = () => {
    const sections = document.querySelectorAll("#app > div");
    const hash = window.location.hash || "#home";

    // Redirect to login if not authenticated
    if (hash === "#profile" && !user) {
      window.location = "../pages/login.html";
      return;
    }

    sections.forEach((section) => {
      section.style.display = `#${section.id}` === hash ? "block" : "none";
    });
  };

  showActiveSection();
  window.addEventListener("hashchange", showActiveSection);
});
