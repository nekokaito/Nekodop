document.addEventListener("DOMContentLoaded", () => {
  initProfile();
  initCameraUpload();
  fetchCats();
  setupEditForm();
});

// Initialize user profile
const initProfile = async () => {
  const profileImg = document.querySelector(".profile-container img");
  const profileName = document.querySelector(".profile-info h1");
  const profileEmail = document.querySelector(".profile-info p:nth-of-type(1)");
  const profileDate = document.querySelector(".profile-info p:nth-of-type(2)");

  const localData = JSON.parse(localStorage.getItem("user"));

  if (!localData?.id) {
    console.error("No user ID found in localStorage");
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:5000/get-user/${localData.id}`
    );
    if (!response.ok) throw new Error("Failed to fetch user data");

    const { user: userData } = await response.json();
    if (userData) {
      profileImg.src = userData.profile_picture || "../images/profile.png";
      profileImg.alt = userData.name || "user profile";
      profileName.textContent = userData.name || "username";
      profileEmail.innerHTML = `<i class="fa-solid fa-at"></i> ${
        userData.email || "email@example.com"
      }`;

      if (userData.created_at) {
        const utcDate = new Date(userData.created_at);

        // convert UTC time to local time 
        const localDate = new Date(
          utcDate.getTime() + utcDate.getTimezoneOffset() * -60000
        );

        const now = new Date();

        const diffMs = now.getTime() - localDate.getTime();
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHr = Math.floor(diffMin / 60);
        const diffDays = Math.floor(diffHr / 24);

        let timeString = "";

        if (diffSec < 60) {
          timeString = "joined a few seconds ago";
        } else if (diffMin < 60) {
          timeString = `joined ${diffMin} minute${
            diffMin === 1 ? "" : "s"
          } ago`;
        } else if (diffHr < 24) {
          timeString = `joined ${diffHr} hour${diffHr === 1 ? "" : "s"} ago`;
        } else {
          timeString = `joined ${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
        }

        profileDate.innerHTML = `<i class="fa-regular fa-calendar"></i> ${timeString}`;
      } else {
        profileDate.textContent = "Join date not available";
      }
    }
  } catch (error) {
    console.error("Error fetching user data:", error.message);
  }
};

// Handle profile picture change
const initCameraUpload = () => {
  const cameraButton = document.querySelector(".camera-button");
  if (!cameraButton) return;

  cameraButton.addEventListener("click", () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.click();

    fileInput.addEventListener("change", () => {
      const file = fileInput.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          document.querySelector(".profile-image img").src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  });
};

// Fetch and display user cats
const fetchCats = async () => {
  const localData = JSON.parse(localStorage.getItem("user"));
  if (!localData?.id) {
    console.error("No user ID found in localStorage");
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:5000/get-cats/${localData.id}`
    );
    const { cats } = await response.json();
    const catsContainer = document.getElementById("cats-container");
    catsContainer.innerHTML = "";

    if (cats?.length) {
      cats.forEach((cat) => {
        const catCard = document.createElement("div");
        catCard.classList.add("card");
        const optimizedImage = cat.cat_image.replace(
          "/upload/",
          "/upload/f_webp,q_40/"
        );
        catCard.innerHTML = `
          <img id="cat-image" src="${optimizedImage}" alt="${cat.cat_name}" class="cat-image" />
          <div class="card-body">
            <div class="cat-info">
              <h3>${cat.cat_name}</h3>
              <p>Age: ${cat.cat_age}</p>
              <p>${cat.cat_gender}</p>
            </div>
            <div class="card-actions">
              <div class="tooltip-container">
                <button class="btn edit-cat"><i class="fa-solid fa-pen-to-square"></i></button>
                <span class="tooltip-text">Edit Details</span>
              </div>
              <div class="tooltip-container">
                <button class="btn delete-cat"><i class="fa-solid fa-trash"></i></button>
                <span class="tooltip-text">Delete</span>
              </div>
            </div>
          </div>
        `;

        // Delete functionality
        catCard
          .querySelector(".delete-cat")
          .addEventListener("click", async () => {
            if (confirm(`Are you sure you want to delete "${cat.cat_name}"?`)) {
              try {
                const res = await fetch(
                  `http://localhost:5000/delete-cat/${cat.id}`,
                  {
                    method: "DELETE",
                  }
                );
                if (!res.ok) throw new Error("Failed to delete cat");
                catCard.remove();
                alert(`"${cat.cat_name}" has been deleted.`);
              } catch (err) {
                console.error("Delete failed:", err);
                alert("Failed to delete cat.");
              }
            }
          });

        // Edit functionality
        catCard.querySelector(".edit-cat").addEventListener("click", () => {
          openEditModal(cat);
        });

        catsContainer.appendChild(catCard);
      });
    } else {
      catsContainer.innerHTML = "<p>No cats found!</p>";
    }
  } catch (error) {
    console.error("Error fetching cats:", error);
  }
};

// Show edit modal
let currentEditingCat = null;

const openEditModal = (cat) => {
  currentEditingCat = cat; // store for use on submit

  document.getElementById("edit-cat-name").value = cat.cat_name;
  document.getElementById("edit-age").value = cat.cat_age;
  document.getElementById("edit-gender").value = cat.cat_gender;
  document.getElementById("edit-phone").value = cat.owner_phone;
  document.getElementById("edit-address").value = cat.owner_address;
  document.getElementById("edit-additional").value = cat.additional_information;
  document.getElementById("edit-description").value = cat.cat_description;
  document.getElementById("edit-status").value =
    cat.adopted === false ? "0" : "1";
  document.getElementById("edit-cat-image-current").value = cat.cat_image;
  document.getElementById("edit-post-modal").classList.remove("hidden");
  document.getElementById("edit-post-form").dataset.postId = cat.id;
};

const closeEditModal = () => {
  document.getElementById("edit-post-modal").classList.add("hidden");
};

// Handle form submit
const setupEditForm = () => {
  document
    .getElementById("edit-post-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const id = e.target.dataset.postId;

      const fileInput = document.getElementById("edit-cat-image-new");
      const currentImage = document.getElementById(
        "edit-cat-image-current"
      ).value;

      let finalImageUrl = currentImage;

      if (fileInput.files.length > 0) {
        const imageFile = fileInput.files[0];
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("upload_preset", "nekodop");

        try {
          const cloudRes = await fetch(
            "https://api.cloudinary.com/v1_1/dyvqe1hgj/image/upload",
            {
              method: "POST",
              body: formData,
            }
          );

          const cloudData = await cloudRes.json();
          finalImageUrl = cloudData.secure_url;
        } catch (err) {
          console.error("Image upload failed:", err);
          alert("Image upload failed, please try again.");
          return;
        }
      }
      const adoptedValue = document.getElementById("edit-status").value;
      const updatedData = {
        catName: document.getElementById("edit-cat-name").value,
        catAge: Number(document.getElementById("edit-age").value),
        catGender: document.getElementById("edit-gender").value,
        ownerPhone: document.getElementById("edit-phone").value,
        ownerAddress: document.getElementById("edit-address").value,
        additionalInformation: document.getElementById("edit-additional").value,
        catDescription: document.getElementById("edit-description").value,
        catImage: finalImageUrl,
        adopted: adoptedValue === "1" ? true : false,
      };

      try {
        const res = await fetch(`http://localhost:5000/update-cat/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
        });

        if (!res.ok) throw new Error("Update failed");

        alert("Cat details updated successfully.");
        closeEditModal();
        fetchCats();
      } catch (err) {
        console.error("Error updating cat:", err);
        alert("Something went wrong while updating.");
      }
    });
};

// Section switching
const showSection = (sectionId, tabId) => {
  document.getElementById("post-section").style.display = "none";
  document.getElementById("my-cats-section").style.display = "none";
  document.getElementById(sectionId).style.display = "block";

  document.getElementById("post-tab").classList.remove("active");
  document.getElementById("my-cats-tab").classList.remove("active");
  document.getElementById(tabId).classList.add("active");
};
