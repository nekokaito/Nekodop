const login = async (email, password) => {
  // Send login request to backend
  await fetch("http://localhost:5000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
    .then((res) => res.json())
    .then((data) => {
      // On success, save user data excluding password
      if (data.user) {
        const { password: _, ...userData } = data.user; // Exclude password
        localStorage.setItem("user", JSON.stringify(userData));

        showToast("Login successful!", "success");
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      } else {
        // Show error message for failed login
        console.error("login failed", data.error);
        const errorDiv = document.getElementById("login-error");
        errorDiv.textContent = "";
        errorDiv.textContent = "Invalid email or password";
        showToast("Invalid email or password", "error");
      }
    })
    .catch((err) => {
      // Handle fetch errors
      console.error("error:", err);
      showToast(`${err.message}`, "error");
    });
};

const loginForm = document.getElementById("login-form");

if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    // Get email and password input values
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    login(email, password);

    // Clear password field after submission
    document.getElementById("password").value = "";
  });
} else {
  console.error("login-form not found in the DOM.");
}
