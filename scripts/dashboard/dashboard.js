import { setupAdoptionActions } from "./adoption-actions.js";
import { fetchPosts } from "./get-posts.js";
import { fetchUsers } from "./get-users.js";

document.addEventListener("DOMContentLoaded", async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userName = user?.name || "Admin";
  const profilePicture = user?.profilePicture || "../images/profile.png";

  document.getElementById("dashboard-username").textContent = userName;
  document.getElementById("dashboard-profile-picture").src = profilePicture;

  await fetchUsers();
  await fetchPosts();
  setupAdoptionActions();
});
