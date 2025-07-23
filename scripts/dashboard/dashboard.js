import { setupAdoptionActions } from "./adoption-actions.js";
import { fetchPosts } from "./get-posts.js";
import { fetchUsers } from "./get-users.js";

document.addEventListener("DOMContentLoaded", async () => {
  await fetchUsers();
  await fetchPosts();
  setupAdoptionActions();
});
