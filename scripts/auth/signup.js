import { validatePassword } from "../utils/check-password.js";

const signup = async (userName, email, password, profilePicture) => {
  // Send signup data to backend
  await fetch("http://localhost:5000/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userName, email, password, profilePicture }),
  })
    .then((res) => res.json())
    .then((data) => {
      // On success, store user and redirect to login
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));

        showToast("Signup successful! Redirecting...", "success");
        setTimeout(() => {
          window.location.href = "/pages/login.html";
        }, 2000);
      } else {
        // Show error on failure
        console.error("Signup failed", data.error);
        showToast("Signup failed: " + (data.error || "Unknown error"), "error");
      }
    })
    .catch((err) => console.error("Error:", err));
};

const signupForm = document.getElementById("login-form");

if (signupForm) {
  signupForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Get form values
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const rePassword = document.getElementById("re-password").value;
    const profilePhotoFiles = document.getElementById("profile-photo").files[0];

    // Validate password
    const validation = validatePassword(password);
    if (!validation.isValid) {
      const errorDiv = document.getElementById("password-error");
      errorDiv.textContent = validation.error;
      return;
    }

    // Check if passwords match
    if (password !== rePassword) {
      const errorDiv = document.getElementById("password-error");

      errorDiv.textContent = "";
      console.error("Passwords do not match");
      errorDiv.textContent = "Passwords do not match";
      return;
    }

    // Check password validity
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      const errorDiv = document.getElementById("password-error");

      errorDiv.textContent = "";
      console.error(passwordValidation.error);
      errorDiv.textContent = passwordValidation.error;
      return;
    }

    // Upload profile photo to Cloudinary if provided
    const handlePhotoUpload = async () => {
      if (!profilePhotoFiles) return null;

      const img = new FormData();
      img.append("file", profilePhotoFiles);
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

    const profilePhoto = await handlePhotoUpload();

    // Call signup function
    await signup(name, email, password, profilePhoto);
  });
} else {
  console.error("Signup form not found in the DOM.");
}
