async function fetchCats() {
  try {
    const res = await fetch("https://nekodop-server.vercel.app/get-cats");
    const data = await res.json();
    const cats = data.cats;
    const container = document.getElementById("cat-container");

    if (cats.length > 0) {
      container.innerHTML = cats
        .map(
          (cat) => `
              <div class="card">
                <img src="${cat.cat_image}" alt="${cat.cat_name}" />
                <div class="card-text">
                  <h2>${cat.cat_name}</h2>
                  <p>Age: ${cat.cat_age}</p>
                  <p>Gender: ${cat.cat_gender}</p>
                  <p>${cat.cat_description}</p>
                  <a href="../pages/cat-details.html?id=${cat.id}" class="details-btn">View Details</a>
                </div>
              </div>
            `
        )
        .join("");
    } else {
      container.innerHTML = "<p>No cats available right now.</p>";
    }
  } catch (error) {
    document.getElementById("cat-container").innerHTML =
      "<p>Failed to load cats. Please try again later.</p>";
    console.error("Error fetching cats:", error);
  }
}

const fetchCatDetails = async () => {
  const params = new URLSearchParams(window.location.search);
  const catId = params.get("id");

  if (!catId) {
    document.getElementById("cat-info").innerHTML = "<p>Cat not found.</p>";
    return;
  }

  try {
    const res = await fetch(
      `https://nekodop-server.vercel.app/get-cat/${catId}`
    );
    const data = await res.json();
    const cat = data.cat;

    if (cat) {
      document.getElementById("cat-name").textContent = cat.cat_name;
      document.getElementById("cat-info").innerHTML = `
        <img src="${cat.cat_image}" alt="${cat.cat_name}" />
        <p>Age: ${cat.cat_age}</p>
        <p>Gender: ${cat.cat_gender}</p>
        <p>Description: ${cat.cat_description}</p>
      `;
    } else {
      document.getElementById("cat-info").innerHTML = "<p>Cat not found.</p>";
    }
  } catch (error) {
    document.getElementById("cat-info").innerHTML =
      "<p>Failed to load cat details.</p>";
    console.error("Error fetching cat details:", error);
  }
};

fetchCats();
fetchCatDetails();
