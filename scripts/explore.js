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
                  <a href="/cat-details.html?id=${cat.id}" class="details-btn">View Details</a>
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

fetchCats();
