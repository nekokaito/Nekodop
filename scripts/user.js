document.addEventListener("DOMContentLoaded", function () {
  const user = JSON.parse(localStorage.getItem("user"));
  const loginBtnDesktop = document.querySelector(".login-desktop");
  const loginBtnMobile = document.querySelector(".login-phn");
  const userNav = document.querySelector(".user-nav");

  if (user) {
    // Hide login buttons
    if (loginBtnDesktop) loginBtnDesktop.style.display = "none";
    if (loginBtnMobile) loginBtnMobile.style.display = "none";

    // Create user icon container
    const userIconContainer = document.createElement("div");
    userIconContainer.classList.add("user-menu");

    // User profile image
    userIconContainer.innerHTML = `
      <div class="user-icon">
        <img src="${user?.profile_picture}" alt="User" class="profile-img" />
      </div>
      <ul class="dropdown-menu">
        <li><a href="/profile">My Profile</a></li>
        <li><button id="logout-btn">Logout</button></li>
      </ul>
    `;

    // Append user icon container to navbar
    userNav.appendChild(userIconContainer);

    // Toggle dropdown menu on profile image click
    const userIcon = userIconContainer.querySelector(".user-icon");
    const dropdownMenu = userIconContainer.querySelector(".dropdown-menu");

    userIcon.addEventListener("click", function (event) {
      event.stopPropagation();
      dropdownMenu.classList.toggle("show");
    });

    document.addEventListener("click", function () {
      dropdownMenu.classList.remove("show");
    });

    dropdownMenu.addEventListener("click", function (event) {
      event.stopPropagation();
    });

    // Logout function
    document
      .getElementById("logout-btn")
      .addEventListener("click", function () {
        localStorage.removeItem("user");
        window.location.reload();
      });
  }
});
