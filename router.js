const routes = {
  "/": { title: "Home", module: "pages/home.js" },
  "/explore": { title: "Explore", module: "pages/explore.js" },
  "/about": {
    title: "About",
    content: "<h1>About Us</h1><p>We build amazing things.</p>",
  },
  "/contact": {
    title: "Contact",
    content: "<h1>Contact Us</h1><p>Email: contact@example.com</p>",
  },
};

const navigateTo = (event, path) => {
  event.preventDefault();
  window.history.pushState({}, "", path);
  updateContent();
}

const updateContent = async () => {
  const path = window.location.pathname;
  const route = routes[path] || routes["/"];

  if (route.module) {
    try {
      const module = await import(`./${route.module}`);
      document.getElementById("app").innerHTML = module.default();
    } catch (error) {
      document.getElementById("app").innerHTML =
        "<h1>404 - Page Not Found</h1>";
    }
  } else {
    document.getElementById("app").innerHTML = route.content;
  }

  document.title = route.title;
}

window.addEventListener("popstate", updateContent);


updateContent();
