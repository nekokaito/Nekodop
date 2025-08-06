import { setupAdoptionActions } from "./adoption-actions.js";
import { fetchPosts } from "./get-posts.js";
import { fetchUsers } from "./get-users.js";

document.addEventListener("DOMContentLoaded", async () => {
  

  await fetchUsers();
  await fetchPosts();
  setupAdoptionActions();
  document.getElementById("dashboard-username").textContent = userName;
  document.getElementById("dashboard-profile-picture").src = profilePicture;
});
