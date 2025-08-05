import { cats } from "./fetch-cats.js";
import { renderCats } from "./render-cats.js";

export const applyFilters = () => {
  // input and checkbox
  const searchInput = document.getElementById("search-input");
  const maleFilter = document.getElementById("male-filter");
  const femaleFilter = document.getElementById("female-filter");
  
  //getting there value
  const searchQuery = searchInput?.value.toLowerCase() || "";
  const maleChecked = maleFilter?.checked;
  const femaleChecked = femaleFilter?.checked;
  
  //filter cat
  const filteredCats = cats.filter((cat) => {
    const nameMatch = cat.cat_name.toLowerCase().includes(searchQuery);
                     
    const genderMatch =
      (!maleChecked && !femaleChecked) || // No filter applied
      (maleChecked && cat.cat_gender.toLowerCase() === "male") ||
      (femaleChecked && cat.cat_gender.toLowerCase() === "female");

      console.log(genderMatch)

    return nameMatch && genderMatch;
  });

  renderCats(filteredCats);
};
