export const updateProfile = (userId) => {
  // Elements
  const closeBtnProfile = document.querySelector(".close-btn-profile");
  const editProfileModal = document.getElementById("edit-profile-modal");
  const openBtnProfile = document.querySelector(".edit-profile-btn");
  const tabPersonal = document.getElementById("tab-personal");
  const tabPassword = document.getElementById("tab-password");
  const personalForm = document.getElementById("edit-profile-form");
  const changePasswordForm = document.getElementById("change-password-form");

  // Open modal and load user data into form
  openBtnProfile.addEventListener("click", () => {
    editProfileModal.classList.remove("hidden");
    fillEditForm();
  });

  // Close modal
  closeBtnProfile.addEventListener("click", () => {
    editProfileModal.classList.add("hidden");
  });

  // Tab click handlers: Personal Details / Change Password
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

  // Store user data globally
  let currentUserData = null;

  // Fetch user data and fill the edit form
  const fillEditForm = async () => {
    try {
      const res = await fetch(`http://localhost:5000/get-user/${userId}`);
      const data = await res.json();

      if (!data || !data.user) {
        console.error("User not found");
        showToast("User Not Found", error);
        return;
      }

      currentUserData = data.user;

      // fill name and email
      document.getElementById("edit-name").value = currentUserData.name || "";
      document.getElementById("edit-email").value = currentUserData.email || "";

      // elements
      const profilePicPreview = document.getElementById(
        "profile-picture-preview"
      );
      const profilePictureContainer = document.getElementById(
        "profile-picture-preview-container"
      );
      const profilePictureInput = document.getElementById(
        "edit-profile-picture"
      );

      // set existing picture from DB
      if (currentUserData.profile_picture) {
        profilePicPreview.src = currentUserData.profile_picture;
        profilePicPreview.classList.remove("hidden");
        profilePictureContainer.classList.remove("hidden");
      } else {
        profilePicPreview.src = "";
        profilePicPreview.classList.add("hidden");
        profilePictureContainer.classList.add("hidden");
        profilePictureContainer.style.border = "none";
      }

      // handle new image selection
      profilePictureInput.addEventListener("change", () => {
        const file = profilePictureInput.files[0];

        if (file) {
          const previewURL = URL.createObjectURL(file);
          console.log(previewURL);
          profilePicPreview.src = previewURL;
          profilePicPreview.classList.remove("hidden");
          profilePictureContainer.classList.remove("hidden");
        } else {
          profilePicPreview.src = "";
          profilePicPreview.classList.add("hidden");
          profilePictureContainer.classList.add("hidden");
        }
      });
    } catch (err) {
      console.error("Failed to fetch user details:", err);
      showToast(
        "Failed to load user details. Please try again later.",
        "error"
      );
    }
  };

  // Update user profile details
  personalForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("edit-name").value.trim();
    const email = document.getElementById("edit-email").value.trim();
    const profilePictureInput = document.getElementById("edit-profile-picture");
    const file = profilePictureInput.files[0];

    let profilePictureUrl = "";

    if (file) {
      // Upload new image to Cloudinary
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
        console.log(cloudData);
        profilePictureUrl = cloudData.secure_url;
      } catch (uploadErr) {
        console.error("Cloudinary upload error:", uploadErr);
        alert("Image upload failed.");
        return;
      }
    } else {
      // No new image uploaded, keep previous picture URL
      profilePictureUrl =
        currentUserData?.profile_picture || "../images/profile.png";
    }

    // Prepare data to send to backend
    const formData = {
      userName: name,
      email: email,
      profilePicture: profilePictureUrl,
    };

    try {
      const res = await fetch(`http://localhost:5000/update-user/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update user.");
      }

      showToast("Profile updated successfully.", "success");
      editProfileModal.classList.add("hidden");

      setTimeout(() => {
        location.reload();
      }, 3000);

      // Update localStorage
      localStorage.setItem("user", JSON.stringify(data.updatedUser));
    } catch (err) {
      console.error("Error updating profile:", err);
      showToast(
        err.message || "Something went wrong while updating user.",
        "error"
      );
    }
  });
};
