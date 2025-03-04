const login = async (email, password) => {
  await fetch("https://nekodop-server.vercel.app/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        console.log("login successful", data.user);
      } else {
        console.error("login failed", data.error);
      }
    })
    .catch((err) => console.error("error:", err));
};

const loginForm = document.getElementById("login-form");

if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    login(email, password);
  });
} else {
  console.error("login-form not found in the DOM.");
}

console.log("js running");
