import { cats } from "./fetch-cats.js";
import { renderCats } from "./render-cats.js";

export const applyFilters = () => {
  // get search input and convert to lowercase

  const searchQuery =
    document.getElementById("search-input")?.value.toLowerCase() || "";

  // get gender filter checkbox states

  const maleChecked = document.getElementById("male-filter")?.checked;
  const femaleChecked = document.getElementById("female-filter")?.checked;

  // filter cats based on search and gender

  const filteredCats = cats.filter((cat) => {
    const matchesSearch =
      cat.cat_name.toLowerCase().includes(searchQuery) ||
      cat.cat_gender.toLowerCase().includes(searchQuery) ||
      String(cat.cat_age).includes(searchQuery);

    const genderMatch =
      (maleChecked && cat.cat_gender.toLowerCase() === "male") ||
      (femaleChecked && cat.cat_gender.toLowerCase() === "female");

    return matchesSearch && genderMatch;
  });

  // render filtered cats

  renderCats(filteredCats);
};
