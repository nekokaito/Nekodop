

document.addEventListener("DOMContentLoaded", () => {
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
