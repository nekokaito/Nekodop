export const initPostForm = () => {
  const postCat = async (
    catOwnerId,
    catName,
    catImage,
    catAge,
    catGender,
    catDescription,
    ownerName,
    ownerAddress,
    ownerPhone,
    ownerEmail,
    additionalInformation
  ) => {
    await fetch("http://localhost:5000/create-cat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        catOwnerId,
        catName,
        catImage,
        catAge,
        catGender,
        catDescription,
        ownerName,
        ownerAddress,
        ownerPhone,
        ownerEmail,
        adopted: false,
        additionalInformation,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          showToast("Posted successfully!", "success");
          console.log("Cat posted successfully:", data);
          document.getElementById("post-form").reset();
        } else {
          console.error("Failed to post cat:", data.error);
        }
      })
      .catch((err) => console.error("Error:", err));
  };

  const postForm = document.getElementById("post-form");

  if (postForm) {
    const clearErrors = () => {
      document.querySelectorAll(".error").forEach((el) => {
        el.textContent = "";
      });
    };

    postForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      clearErrors();

      const userData = JSON.parse(localStorage.getItem("user"));
      if (!userData || !userData.id) {
        console.error("No user ID found in localStorage");
        return;
      }

      const catOwnerId = userData.id;
      const ownerEmail = userData.email || "not available";
      const ownerName = userData.name || "not available";

      const catName = document.getElementById("cat-name").value.trim();
      const catAge = parseInt(document.getElementById("age").value);
      const catGender = document.getElementById("gender").value;
      const ownerPhone = document.getElementById("phone").value.trim();
      const ownerAddress = document.getElementById("address").value.trim();
      const additionalInformation = document
        .getElementById("additional")
        .value.trim();
      const catDescription = document
        .getElementById("description")
        .value.trim();
      const catImageFile = document.getElementById("cat-image").files[0];

      let hasError = false;

      // Validate inputs

      //Cat name

      if (!catName) {
        document.getElementById("error-cat-name").textContent =
          "Cat name is required.";
        hasError = true;
      }

      //Age validation

      if (isNaN(catAge) || catAge <= 0.1 || catAge > 25) {
        document.getElementById("error-age").textContent =
          "Age must be between 1 and 25.";
        hasError = true;
      }

      //Phone number validation

      if (!/^\d+$/.test(ownerPhone)) {
        document.getElementById("error-phone").textContent =
          "Phone number must be numeric only.";
        hasError = true;
      } else if (ownerPhone.length !== 11) {
        document.getElementById("error-phone").textContent =
          "Phone number must be exactly 11 digits.";
        hasError = true;
      } else if (!/^01/.test(ownerPhone)) {
        document.getElementById("error-phone").textContent =
          "Phone number must start with '01'.";
        hasError = true;
      }

      // Image validation

      if (!catImageFile) {
        document.getElementById("error-image").textContent =
          "Please upload a cat image.";
        hasError = true;
      } else {
        const imageSizeMB = catImageFile.size / (1024 * 1024);

        if (imageSizeMB > 2) {
          document.getElementById("error-image").textContent =
            "Image must be under 2MB.";
          hasError = true;
        }
      }

      if (hasError) return;

      const handlePhotoUpload = async () => {
        const img = new FormData();
        img.append("file", catImageFile);
        img.append("upload_preset", "nekodop");
        img.append("cloud_name", "dyvqe1hgj");

        const res = await fetch(
          "https://api.cloudinary.com/v1_1/dyvqe1hgj/image/upload",
          {
            method: "POST",
            body: img,
          }
        );

        const uploadedImg = await res.json();
        return uploadedImg.url;
      };

      const catImage = await handlePhotoUpload();

      await postCat(
        catOwnerId,
        catName,
        catImage,
        catAge,
        catGender,
        catDescription,
        ownerName,
        ownerAddress,
        ownerPhone,
        ownerEmail,
        additionalInformation
      );
    });
  } else {
    console.error("Post form not found in the DOM.");
  }
};
