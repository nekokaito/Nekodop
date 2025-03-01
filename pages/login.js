const LoginPage = () => {
  return `
    <div classname="login-container">
      <section id="form-section">
        <div id="logo">
          <span id="logo-text">Login</span>
        </div>

        <form id="login-form">
          <div id="email-group">
            <label for="email">Email Address</label>
            <input type="email" id="email" required />
          </div>
          <div id="password-group">
            <label for="password">Password</label>
            <input type="password" id="password" required />
          </div>
          <button type="submit" id="submit-button">Submit</button>
        </form>
      </section>

      <section id="content-section">
        <div id="content">
          <div id="illustration">
            <div id="paper-plane-wrapper">
              <div id="plane">
                <div id="trail">
                  <img id="paper-plane" src="/images/paperfly.png" alt="Paper Plane" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>`;
};

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

document.querySelector(".container").innerHTML = LoginPage();

document.getElementById("login-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  login(email, password);
});

export default LoginPage;
