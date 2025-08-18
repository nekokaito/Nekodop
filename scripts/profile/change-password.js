import { validatePassword } from "../utils/check-password.js";

// Update user password
export const changePassword = (userId) => {
  const changePasswordForm = document.getElementById("change-password-form");

  changePasswordForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Clear any previous error messages
    document.getElementById("current-password-error").textContent = "";
    document.getElementById("confirm-password-error").textContent = "";

    const currentPassword = document
      .getElementById("current-password")
      .value.trim();
    const newPassword = document.getElementById("new-password").value.trim();
    const confirmPassword = document
      .getElementById("confirm-password")
      .value.trim();

    const validation = validatePassword(newPassword);
    if (!validation.isValid) {
      const errorDiv = document.getElementById("new-password-error");
      errorDiv.textContent = validation.error;
      return;
    }

    // Check if confirm passwords match
    if (newPassword !== confirmPassword) {
      const errorDiv = document.getElementById("confirm-password-error");
      errorDiv.textContent = "New passwords do not match!";
      return;
    }

    try {
      const res = await fetch(
        `https://nekodop-api.vercel.app/update-password/${userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ currentPassword, newPassword }),
        }
      );

      const data = await res.json();

      if (res.status === 401) {
        const errorDiv = document.getElementById("current-password-error");
        errorDiv.textContent = "Current password is incorrect!";
        return;
      }

      if (res.status === 200) {
        showToast("Password updated successfully.", "success");
        document.getElementById("edit-profile-modal").classList.add("hidden");

        // Clear all fields
        changePasswordForm.reset();
      } else {
        showToast(data.error || "Failed to update password.", "error");
      }
    } catch (err) {
      console.error("Error updating password:", err);
      showToast("Error connecting to server.", "error");
    }
  });
};
