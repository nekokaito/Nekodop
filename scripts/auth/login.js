const login = async (email, password) => {
  await fetch("http://localhost:5000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.user) {
        const { password: _, ...userData } = data.user; // Exclude password
        localStorage.setItem("user", JSON.stringify(userData));

        showToast("Login successful!", "success");
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      } else {
        console.error("login failed", data.error);
        const errorDiv = document.getElementById("login-error");
        errorDiv.textContent = "";
        errorDiv.textContent = "Invalid email or password";
        showToast("Invalid email or password", "error");
      }
    })
    .catch((err) => {
      console.error("error:", err);
      showToast(`${err.message}`, "error");
    });
};

const loginForm = document.getElementById("login-form");

if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    login(email, password);

    // Clear password
    document.getElementById("password").value = "";
  });
} else {
  console.error("login-form not found in the DOM.");
}
