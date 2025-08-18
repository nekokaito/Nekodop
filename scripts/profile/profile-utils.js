// Initialize and load the user profile info from backend and localStorage

export const initProfile = async () => {
  const profileImg = document.querySelector(".profile-container img");
  const profileName = document.querySelector(".profile-info h1");
  const profileEmail = document.querySelector(".profile-info p:nth-of-type(1)");
  const profileDate = document.querySelector(".profile-info p:nth-of-type(2)");
  const localData = JSON.parse(localStorage.getItem("user"));

  if (!localData?.id) return console.error("No user ID found in localStorage");

  try {
    const res = await fetch(`http://localhost:5000/get-user/${localData.id}`);
    if (!res.ok) throw new Error("Failed to fetch user data");

    const { user: userData } = await res.json();
    console.log(userData);
    if (!userData) return;

    // Set user profile picture or fallback
    profileImg.src = userData.profile_picture || "../images/profile.png";
    profileImg.alt = userData.name || "user profile";

    // Set user name or fallback
    profileName.textContent = userData.name || "username";

    // Display email with icon
    profileEmail.innerHTML = `<i class="fa-solid fa-at"></i> ${
      userData.email || "email@example.com"
    }`;

    // Convert and show relative join date
    if (userData.created_at) {
      const utcDate = new Date(userData.created_at);
      const localDate = new Date(
        utcDate.getTime() + -utcDate.getTimezoneOffset() * 60000
      );

      const now = new Date();
      const diffSec = Math.floor((now - localDate) / 1000);
      const diffMin = Math.floor(diffSec / 60);
      const diffHr = Math.floor(diffMin / 60);
      const diffDays = Math.floor(diffHr / 24);

      let timeString = "";

      if (diffSec < 60) timeString = "joined a few seconds ago";
      else if (diffMin < 60)
        timeString = `joined ${diffMin} minute${diffMin !== 1 ? "s" : ""} ago`;
      else if (diffHr < 24)
        timeString = `joined ${diffHr} hour${diffHr !== 1 ? "s" : ""} ago`;
      else
        timeString = `joined ${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;

      profileDate.innerHTML = `<i class="fa-regular fa-calendar"></i> ${timeString}`;
    }
  } catch (err) {
    console.error("Error fetching user data:", err.message);
  }
};

export const initCameraUpload = () => {
  const cameraButton = document.querySelector(".camera-button");
  if (!cameraButton) return;

  cameraButton.addEventListener("click", () => {
    // Dynamically create file input and trigger click
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.click();

    fileInput.addEventListener("change", async () => {
      const file = fileInput.files?.[0];
      if (!file) return;

      // Preview the selected image in the profile UI
      const reader = new FileReader();
      reader.onload = (e) => {
        document.querySelector(".profile-image img").src = e.target.result;
      };
      reader.readAsDataURL(file);

      // Prepare image for Cloudinary upload
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "nekodop");
      formData.append("cloud_name", "dyvqe1hgj");

      try {
        // Upload to Cloudinary
        const cloudRes = await fetch(
          "https://api.cloudinary.com/v1_1/dyvqe1hgj/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        const cloudData = await cloudRes.json();
        const imageUrl = cloudData.url;

        // Get current user
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.id) {
          console.error("User not logged in");
          return;
        }

        // Update user profile picture in backend
        const res = await fetch(
          `http://localhost:5000/update-user/${user.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ profilePicture: imageUrl }),
          }
        );

        // On successful update, also update localStorage
        if (res.ok) {
          const updatedUser = { ...user, profilePicture: imageUrl };
          localStorage.setItem("user", JSON.stringify(updatedUser));
          showToast("Profile picture updated!", "success");
        } else {
          console.error("Failed to update user on server");
          showToast("Server update failed", "error");
        }
      } catch (err) {
        console.error("Failed to upload or update:", err);
        showToast("Failed to update profile picture", "error");
      }
    });
  });
};

// Controls which dashboard section (post or my cats) is visible

export const showSection = (sectionId, tabId) => {
  //section
  document.getElementById("post-section").style.display = "none";
  document.getElementById("my-cats-section").style.display = "none";

  document.getElementById(sectionId).style.display = "block";

  // tab
  document.getElementById("post-tab").classList.remove("active");
  document.getElementById("my-cats-tab").classList.remove("active");

  document.getElementById(tabId).classList.add("active");
};
