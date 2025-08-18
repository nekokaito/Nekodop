import { getUser, checkIsAdmin } from "./auth-utils.js";

document.addEventListener("DOMContentLoaded", async function () {
  const user = getUser();
  // Fetch admin status
  const isAdmin = await checkIsAdmin();
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
        <img src="${
          user?.profile_picture || "../images/profile.png"
        }" alt="User" class="profile-img" />
      </div>
      <ul class="dropdown-menu">
        <li><a href="../pages/profile.html"><i class="fa-regular fa-circle-user" style="margin-right: 3px;"></i> My Profile</a></li>
       ${
         isAdmin
           ? `<li><a href="../pages/dashboard.html"><i class="fa-solid fa-calendar" style="margin-right: 3px;"></i> Dashboard</a></li>`
           : ""
       }
        <li><button id="logout-btn"><i class="fa-solid fa-right-from-bracket" style="margin-right: 3px;"></i> Logout</button></li>
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
        showToast("Logged Out", "success");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      });
  }
});
