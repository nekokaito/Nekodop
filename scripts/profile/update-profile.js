const closeBtnProfile = document.querySelector(".close-btn-profile");
const editProfileModal = document.getElementById("edit-profile-modal");
const openBtnProfile = document.querySelector(".edit-profile-btn");

const tabPersonal = document.getElementById("tab-personal");
const tabPassword = document.getElementById("tab-password");

const personalForm = document.getElementById("edit-profile-form");
const changePasswordForm = document.getElementById("change-password-form");

const userId = JSON.parse(localStorage.getItem("user")).id;

// Open modal and pre-fill form
openBtnProfile.addEventListener("click", () => {
  editProfileModal.classList.remove("hidden");
  fillEditForm();
  console.log("Edit profile modal opened");
});

closeBtnProfile.addEventListener("click", () => {
  editProfileModal.classList.add("hidden");
  console.log("Edit profile modal closed");
});

// Tab switching
tabPersonal.addEventListener("click", () => {
  tabPersonal.classList.add("active");
  tabPassword.classList.remove("active");

  personalForm.classList.remove("hidden");
  changePasswordForm.classList.add("hidden");
});

tabPassword.addEventListener("click", () => {
  tabPassword.classList.add("active");
  tabPersonal.classList.remove("active");

  changePasswordForm.classList.remove("hidden");
  personalForm.classList.add("hidden");
});

// Fetch and fill profile details
const fillEditForm = async () => {
  try {
    const res = await fetch(`http://localhost:5000/get-user/${userId}`);
    const data = await res.json();
    console.log("Fetched user data:", data);
    if (!data || !data.user) {
      console.error("User not found");
      return;
    }

    document.getElementById("edit-name").value = data.user.name || "";
    document.getElementById("edit-email").value = data.user.email || "";

    const profilePicPreview = document.getElementById(
      "profile-picture-preview"
    );
    if (profilePicPreview) {
      if (data.user.profile_picture) {
        profilePicPreview.src = data.user.profile_picture;
        profilePicPreview.classList.remove("hidden");
      } else {
        profilePicPreview.classList.add("hidden");
      }
    }
  } catch (err) {
    console.error("Failed to fetch user details:", err);
  }
}

// Handle personal details submit
personalForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("edit-name").value;
  const email = document.getElementById("edit-email").value;
  const profilePictureInput = document.getElementById("edit-profile-picture");
  const file = profilePictureInput.files[0];

  let profilePictureUrl = "";

  if (file) {
    const cloudForm = new FormData();
    cloudForm.append("file", file);
    cloudForm.append("upload_preset", "nekodop");
    cloudForm.append("cloud_name", "dyvqe1hgj");

    try {
      const cloudRes = await fetch(
        "https://api.cloudinary.com/v1_1/dyvqe1hgj/image/upload",
        {
          method: "POST",
          body: cloudForm,
        }
      );

      const cloudData = await cloudRes.json();
      profilePictureUrl = cloudData.secure_url;
    } catch (uploadErr) {
      console.error("Cloudinary upload error:", uploadErr);
      alert("Image upload failed.");
      return;
    }
  }

  const formData = {
    userName: name,
    email: email,
    profilePicture: profilePictureUrl,
  };

  try {
    const res = await fetch(`http://localhost:5000/update-user/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    console.log("User updated:", data);
    alert("Profile updated successfully.");
    editProfileModal.classList.add("hidden");

    // Update localStorage to keep in sync
    localStorage.setItem("user", JSON.stringify(data.updatedUser));
  } catch (err) {
    console.error("Error updating profile:", err);
    alert("Something went wrong while updating user.");
  }
});

// Handle password change submit
changePasswordForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const currentPassword = document.getElementById("current-password").value;
  const newPassword = document.getElementById("new-password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  if (newPassword !== confirmPassword) {
    alert("New passwords do not match!");
    return;
  }

  // TODO: Implement password change API call here
  console.log({
    currentPassword,
    newPassword,
  });

  alert("Password change function not implemented yet.");
});

console.log("Edit profile script loaded");
