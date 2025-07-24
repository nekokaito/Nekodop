import { initProfile, initCameraUpload, showSection } from "./profile-utils.js";
import { fetchCats, setupEditForm } from "./profile-cats.js";
import { initPostForm } from "./post-cat.js";
import { updateProfile } from "./update-profile.js";
import { changePassword } from "./change-password.js";

document.addEventListener("DOMContentLoaded", () => {
  // Get logged-in user ID from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user.id;

  initProfile();
  initCameraUpload();
  fetchCats();
  initPostForm();
  setupEditForm();
  updateProfile(userId);
  changePassword(userId);
});

//  showSection globally
window.showSection = showSection;
