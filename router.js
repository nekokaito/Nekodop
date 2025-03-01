// const routes = {
//   "/": { title: "Home", module: "pages/home.js" },
//   "/explore": { title: "Explore", module: "pages/explore.js" },
//   "/about": {
//     title: "About",
//     content: "<h1>About Us</h1><p>We build amazing things.</p>",
//   },
//   "/contact": { title: "Contact", module: "pages/contact.js" },
// };

// const navigateTo = (event, path) => {
//   event.preventDefault();
//   window.history.pushState({}, "", path);
//   updateContent();
// };

// const updateContent = async () => {
//   const path = window.location.pathname;
//   const route = routes[path] || routes["/"];

//   if (route.module) {
//     try {
//       const module = await import(`./${route.module}`);
//       document.getElementById("app").innerHTML = module.default();
//     } catch (error) {
//       document.getElementById("app").innerHTML =
//         "<h1>404 - Page Not Found</h1>";
//     }
//   } else {
//     document.getElementById("app").innerHTML = route.content;
//   }

//   document.title = route.title;
// };

// window.addEventListener("popstate", updateContent);

// updateContent();

// Function to load HTML content from a file
async function loadHTML(file) {
  try {
      const response = await fetch(file);
      if (!response.ok) {
          throw new Error(`Failed to load ${file}: ${response.statusText}`);
      }
      return await response.text();
  } catch (error) {
      console.error(error);
      return `<h1>Error loading content</h1>`;
  }
}

// Function to render the content based on the current route
async function renderContent(route) {
  const app = document.getElementById('app');
  let content = '';

  switch (route) {
      case '/':
          content = await loadHTML('/pages/home.html');
          break;
      case '/contact':
          content = await loadHTML('/pages/contact.html');
          break;
      default:
          content = `<h1>404 - Page Not Found</h1>`;
          break;
  }

  app.innerHTML = content;
}

// Function to handle routing
function router() {
  const path = window.location.hash.slice(1) || '/';
  renderContent(path);
}

// Event listener for hash change
window.addEventListener('hashchange', router);

// Initial render
window.addEventListener('load', router);