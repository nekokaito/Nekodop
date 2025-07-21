import { renderCats } from "./render-cats.js";

export let cats = []; // store fetched cats here

export const fetchCats = async () => {
  try {
    // fetch cats from backend
    
    const res = await fetch("http://localhost:5000/get-cats");
    const data = await res.json();

    cats = data.cats; 

    renderCats(cats); // render cats on page
  } catch (error) {
    // show error message if fetch fails

    document.getElementById("cat-container").innerHTML =
      "<p>Failed to load cats. Please try again later.</p>";
    console.error("Error fetching cats:", error);
  }
};
