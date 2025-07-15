import { renderCats } from "./render-cats.js";

export let cats = [];

export const fetchCats = async () => {
  try {
    const res = await fetch("http://localhost:5000/get-cats");
    const data = await res.json();
    cats = data.cats;

    renderCats(cats);
  } catch (error) {
    document.getElementById("cat-container").innerHTML =
      "<p>Failed to load cats. Please try again later.</p>";
    console.error("Error fetching cats:", error);
  }
};
