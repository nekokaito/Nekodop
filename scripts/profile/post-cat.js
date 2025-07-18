// Initializes the post form logic

showToast("Make Sure Phone Number has WhatsApp", "info");

export const initPostForm = () => {
  // Function to submit a new cat to the backend

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
        adopted: false, // always false when creating new
        additionalInformation,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          showToast("Posted successfully!", "success");
          console.log("Cat posted successfully:", data);
          document.getElementById("post-form").reset(); // Reset form
        } else {
          console.error("Failed to post cat:", data.error);
        }
      })
      .catch((err) => console.error("Error:", err));
  };

  const postForm = document.getElementById("post-form");

  if (postForm) {
    // Helper: Clear all previous error messages

    const clearErrors = () => {
      document.querySelectorAll(".error").forEach((el) => {
        el.textContent = "";
      });
    };

    // Form submit listener

    postForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      clearErrors();

      // Get user data from localStorage

      const userData = JSON.parse(localStorage.getItem("user"));
      if (!userData || !userData.id) {
        console.error("No user ID found in localStorage");
        return;
      }

      // Extract user details

      const catOwnerId = userData.id;
      const ownerEmail = userData.email || "not available";
      const ownerName = userData.name || "not available";

      // Collect form field values

      const catName = document.getElementById("cat-name").value.trim();
      const year = parseInt(document.getElementById("year").value.trim()) || 0;
      const month =
        parseInt(document.getElementById("month").value.trim()) || 0;
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

      // --- VALIDATIONS ---

      // Cat name required

      if (!catName) {
        document.getElementById("error-cat-name").textContent =
          "Cat name is required.";
        hasError = true;
      }

      // Year must be in range 0–25

      if (year < 0 || year > 25) {
        document.getElementById("error-year").textContent =
          "Year must be between 0 and 25.";
        hasError = true;
      }

      // Month must be in range 0–12

      if (month < 0 || month > 12) {
        document.getElementById("error-month").textContent =
          "Month must be between 0 and 12.";
        hasError = true;
      }

      // If both year and month are 0, show error

      if (year === 0 && month === 0) {
        document.getElementById("error-month").textContent =
          "Month is required if year is 0.";
        hasError = true;
      }

      // Generate readable age label

      const yearLabel = year === 1 ? "year" : "years";
      const monthLabel = month === 1 ? "month" : "months";
      const catAge = `${year} ${yearLabel} ${month} ${monthLabel}`;

      // Validate phone number format

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

      // Validate cat image

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

      // Stop form submission if any errors

      if (hasError) return;

      // Upload image to Cloudinary

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
        return uploadedImg.url; // Return image URL to save in DB
      };

      // Upload the image and post the cat

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
    showToast("Post form not found", "error");
  }
};
