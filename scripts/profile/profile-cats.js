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
        </div>`;

      catCard
        .querySelector(".delete-cat")
        .addEventListener("click", async () => {
          if (!confirm(`Are you sure you want to delete "${cat.cat_name}"?`))
            return;

          try {
            const delRes = await fetch(
              `http://localhost:5000/delete-cat/${cat.id}`,
              {
                method: "DELETE",
              }
            );

            if (!delRes.ok) throw new Error("Failed to delete cat");
            catCard.remove();
            alert(`"${cat.cat_name}" has been deleted.`);
          } catch (err) {
            console.error("Delete failed:", err);
            alert("Failed to delete cat.");
          }
        });

      catCard.querySelector(".edit-cat").addEventListener("click", () => {
        openEditModal(cat);
      });

      catsContainer.appendChild(catCard);
    });
  } catch (err) {
    console.error("Error fetching cats:", err);
  }
};

let currentEditingCat = null;

export const openEditModal = (cat) => {
  currentEditingCat = cat;

  document.getElementById("edit-cat-name").value = cat.cat_name;
  document.getElementById("edit-age").value = cat.cat_age;
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

export const closeEditModal = () => {
  document.getElementById("edit-post-modal").classList.add("hidden");
};

export const setupEditForm = () => {
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
        adopted: adoptedValue === "1",
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
