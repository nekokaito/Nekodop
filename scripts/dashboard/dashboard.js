import { fetchPosts } from "./get-posts.js";
import { fetchUsers } from "./get-users.js";

document.addEventListener("DOMContentLoaded", () => {
  fetchUsers();
  fetchPosts();
});
