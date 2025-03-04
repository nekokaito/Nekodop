document.addEventListener("DOMContentLoaded", function () {
  const user = JSON.parse(localStorage.getItem("user"));
  const loginBtnDesktop = document.querySelector(".login-desktop");
  const loginBtnMobile = document.querySelector(".login-phn");
  const userNav = document.querySelector(".user-nav");

  if (user) {
    // Hide login buttons
    if (loginBtnDesktop) loginBtnDesktop.style.display = "none";
    if (loginBtnMobile) loginBtnMobile.style.display = "none";

    // Create user icon element
    const userIcon = document.createElement("div");
    userIcon.classList.add("user-icon");
    userIcon.innerHTML = `
      <a href="/profile">
        <img src="${user?.profile_picture}" alt="User" class="profile-img"/>
      </a>
    `;

    // Append user icon to navbar
    userNav.appendChild(userIcon);
  }
});
