import { cats } from "./fetch-cats.js";
import { renderCats } from "./render-cats.js";

export const applyFilters = () => {
  const searchQuery =
    document.getElementById("search-input")?.value.toLowerCase() || "";
  const maleChecked = document.getElementById("male-filter")?.checked;
  const femaleChecked = document.getElementById("female-filter")?.checked;

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

  renderCats(filteredCats);
};
