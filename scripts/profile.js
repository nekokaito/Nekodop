document.addEventListener("DOMContentLoaded", function () {
  const profileImg = document.querySelector(".profile-container img");
  const profileName = document.querySelector(".profile-info h1");
  const profileEmail = document.querySelector(".profile-info p:nth-of-type(1)");
  const profileDate = document.querySelector(".profile-info p:nth-of-type(2)");

  // Fetch user data from localStorage
  let userData = JSON.parse(localStorage.getItem("user"));

  if (userData) {
    profileImg.src = userData.profile_picture || "default.jpg";
    profileImg.alt = userData.name || "User Profile";
    profileName.textContent = userData.name || "Username";
    profileEmail.innerHTML =
      `<i class="fa-solid fa-at"></i> ${userData.email}` || "email@example.com";
    if (userData.created_at) {
      const createdDate = new Date(userData.created_at);
      const currentDate = new Date();
      const diffTime = Math.abs(currentDate - createdDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      profileDate.innerHTML = `<i class="fa-regular fa-calendar"></i> Joined ${diffDays} days ago`;
    } else {
      profileDate.textContent = "Not Available";
    }
  }
});
