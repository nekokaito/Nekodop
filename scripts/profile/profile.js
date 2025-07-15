import { initProfile, initCameraUpload, showSection } from "./profile-utils.js";
import { fetchCats, setupEditForm } from "./profile-cats.js";
import { initPostForm } from "./post-cat.js";

document.addEventListener("DOMContentLoaded", () => {
  initProfile();
  initCameraUpload();
  fetchCats();
  initPostForm();
  setupEditForm();
});

//  showSection globally
window.showSection = showSection;
