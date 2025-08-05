
export const preLoading = () => {
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
}

