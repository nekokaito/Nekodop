import { renderPosts } from "./render-posts.js";

let allCats = [];

// Fetch all cats from backend
export const fetchPosts = async () => {
  try {
    const res = await fetch("http://localhost:5000/admin/get-cats");
    const data = await res.json();
    allCats = data.cats || [];
    return allCats;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
};

// Filter cats by approval status
const filterCats = (status) => {
  switch (status) {
    case "approved":
      return allCats.filter((cat) => cat.is_approved === 1);
    case "pending":
      return allCats.filter((cat) => cat.is_approved === 0);
    case "rejected":
      return allCats.filter((cat) => cat.is_approved === 2);
    default:
      return allCats;
  }
};

// Setup filter and refresh functionality
const setupPostActions = () => {
  const refreshBtn = document.getElementById("refresh-posts");
  const filterSelect = document.getElementById("filter");

  if (!refreshBtn || !filterSelect) {
    console.warn("Post filter or refresh elements not found.");
    return;
  }

  // Handle filter change
  filterSelect.addEventListener("change", () => {
    const selected = filterSelect.value;
    const filtered = filterCats(selected);
    renderPosts(filtered);
  });

  // Handle refresh click
  refreshBtn.addEventListener("click", async () => {
    await fetchPosts();
    const selected = filterSelect.value;
    const filtered = filterCats(selected);
    renderPosts(filtered);
  });
};

window.addEventListener("DOMContentLoaded", async () => {
  await fetchPosts(); // first fetch the data
  setupPostActions();

  const initialFilter = document.getElementById("filter")?.value || "all";
  const filtered = filterCats(initialFilter);
  renderPosts(filtered);

  
  const approvedCount = filterCats("approved").length;
  const pendingCount = filterCats("pending").length;
  const rejectedCount = filterCats("rejected").length;

  // update to UI
  document.getElementById("approved-count").textContent = approvedCount;
  document.getElementById("pending-count").textContent = pendingCount;
  document.getElementById("rejected-count").textContent = rejectedCount;
});
