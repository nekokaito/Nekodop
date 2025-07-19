// Fetch all cats belonging to the logged-in user
export const fetchCats = async () => {
  const localData = JSON.parse(localStorage.getItem("user"));
  if (!localData?.id) return console.error("No user ID found in localStorage");

  try {
    const res = await fetch(`http://localhost:5000/get-cats/${localData.id}`);
    const { cats } = await res.json();

    const catsContainer = document.getElementById("cats-container");
    catsContainer.innerHTML = "";

    if (!cats?.length)
      return (catsContainer.innerHTML = "<p>No cats found!</p>");

    cats.forEach((cat) => {
      const catCard = document.createElement("div");
      catCard.classList.add("card");

      // Optimize image loading from Cloudinary
      const optimizedImage = cat.cat_image.replace(
        "/upload/",
        "/upload/f_webp,q_40/"
      );

      // Render each cat card
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
        </div>`;

      // Handle delete cat action
      catCard
        .querySelector(".delete-cat")
        .addEventListener("click", async () => {
          if (!confirm(`Are you sure you want to delete "${cat.cat_name}"?`))
            return;

          try {
            const delRes = await fetch(
              `http://localhost:5000/delete-cat/${cat.id}`,
              { method: "DELETE" }
            );

            if (!delRes.ok) throw new Error("Failed to delete cat");

            catCard.remove(); // Remove card from DOM
            alert(`"${cat.cat_name}" has been deleted.`);
          } catch (err) {
            console.error("Delete failed:", err);
            alert("Failed to delete cat.");
          }
        });

      // Handle edit cat action
      catCard.querySelector(".edit-cat").addEventListener("click", () => {
        openEditModal(cat);
      });

      catsContainer.appendChild(catCard);
    });
  } catch (err) {
    console.error("Error fetching cats:", err);
  }
};

// Holds the current cat being edited
let currentEditingCat = null;

// Open edit modal and prefill with cat data
export const openEditModal = (cat) => {
  currentEditingCat = cat;

  document.getElementById("edit-cat-name").value = cat.cat_name;

  const [yearMatch, monthMatch] = [
    cat.cat_age.match(/(\d+)\s*year/),
    cat.cat_age.match(/(\d+)\s*month/),
  ];

  document.getElementById("edit-year").value = yearMatch ? yearMatch[1] : 0;
  document.getElementById("edit-month").value = monthMatch ? monthMatch[1] : 0;
  document.getElementById("edit-gender").value = cat.cat_gender;
  document.getElementById("edit-phone").value = cat.owner_phone;
  document.getElementById("edit-address").value = cat.owner_address;
  document.getElementById("edit-additional").value = cat.additional_information;
  document.getElementById("edit-description").value = cat.cat_description;
  document.getElementById("edit-status").value = cat.adopted ? "1" : "0";
  document.getElementById("edit-cat-image-current").value = cat.cat_image;

  document.getElementById("edit-post-modal").classList.remove("hidden");
  document.getElementById("edit-post-form").dataset.postId = cat.id;
};

// Close the edit modal
export const closeEditModal = () => {
  document.getElementById("edit-post-modal").classList.add("hidden");
};

// JavaScript after DOM loaded
document.querySelector(".close-btn").addEventListener("click", closeEditModal);
window.closeEditModal = closeEditModal;


// Setup the edit form functionality
export const setupEditForm = () => {
  document
    .getElementById("edit-post-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const id = e.target.dataset.postId;

      // Get form values
      const catName = document.getElementById("edit-cat-name").value.trim();
      const year =
        parseInt(document.getElementById("edit-year").value.trim()) || 0;
      const month =
        parseInt(document.getElementById("edit-month").value.trim()) || 0;
      const catGender = document.getElementById("edit-gender").value;
      const ownerPhone = document.getElementById("edit-phone").value.trim();
      const ownerAddress = document.getElementById("edit-address").value.trim();
      const additionalInformation = document
        .getElementById("edit-additional")
        .value.trim();
      const catDescription = document
        .getElementById("edit-description")
        .value.trim();
      const adoptedValue = document.getElementById("edit-status").value;
      const fileInput = document.getElementById("edit-cat-image-new");
      const currentImage = document.getElementById(
        "edit-cat-image-current"
      ).value;

      let finalImageUrl = currentImage;

      // Clear previous error messages
      document.getElementById("edit-error-cat-name").textContent = "";
      document.getElementById("edit-error-year").textContent = "";
      document.getElementById("edit-error-month").textContent = "";
      document.getElementById("edit-error-phone").textContent = "";
      document.getElementById("edit-error-image").textContent = "";

      let hasError = false;

      // Input validations

      // Cat name validation

      if (!catName) {
        document.getElementById("edit-error-cat-name").textContent =
          "Cat name is required.";
        hasError = true;
      }
      // Age validation

      if (year < 0 || year > 25) {
        document.getElementById("edit-error-year").textContent =
          "Year must be between 0 and 25.";
        hasError = true;
      }

      if (month < 0 || month > 12) {
        document.getElementById("edit-error-month").textContent =
          "Month must be between 0 and 12.";
        hasError = true;
      }

      if (year === 0 && month === 0) {
        document.getElementById("edit-error-month").textContent =
          "Month is required if year is 0.";
        hasError = true;
      }
      // Phone number validation

      if (!/^\d+$/.test(ownerPhone)) {
        document.getElementById("edit-error-phone").textContent =
          "Phone number must be numeric.";
        hasError = true;
      } else if (ownerPhone.length !== 11) {
        document.getElementById("edit-error-phone").textContent =
          "Phone number must be exactly 11 digits.";
        hasError = true;
      } else if (!/^01/.test(ownerPhone)) {
        document.getElementById("edit-error-phone").textContent =
          "Phone number must start with '01'.";
        hasError = true;
      }

      // Image validation if new image is selected
      if (fileInput.files.length > 0) {
        const catImageFile = fileInput.files[0];
        const imageSizeMB = catImageFile.size / (1024 * 1024);
        if (imageSizeMB > 2) {
          document.getElementById("edit-error-image").textContent =
            "Image must be under 2MB.";
          hasError = true;
        }
      }

      if (hasError) return; // Stop if validation failed

      // Upload image to Cloudinary if new file selected

      if (fileInput.files.length > 0) {
        const imageFile = fileInput.files[0];
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("upload_preset", "nekodop");

        try {
          const cloudRes = await fetch(
            "https://api.cloudinary.com/v1_1/dyvqe1hgj/image/upload",
            { method: "POST", body: formData }
          );
          const cloudData = await cloudRes.json();
          finalImageUrl = cloudData.secure_url;
        } catch (err) {
          console.error("Image upload failed:", err);
          alert("Image upload failed, please try again.");
          return;
        }
      }

      // Format age string

      let catAge = "";
      if (year > 0) catAge += `${year} year${year > 1 ? "s" : ""} `;
      if (year === 0 || month > 0)
        catAge += `${month} month${month > 1 ? "s" : ""}`;

      // Prepare update payload

      const updatedData = {
        catName,
        catAge,
        catGender,
        ownerPhone,
        ownerAddress,
        additionalInformation,
        catDescription,
        catImage: finalImageUrl,
        adopted: adoptedValue === "1",
      };

      // Send update request to server

      try {
        const res = await fetch(`http://localhost:5000/update-cat/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
        });

        if (!res.ok) throw new Error("Update failed");

        showToast("Cat details updated successfully!", "success");
        closeEditModal();
        fetchCats(); // Refresh the UI
      } catch (err) {
        console.error("Error updating cat:", err);
        showToast("Something went wrong while updating.", "error");
      }
    });
};
