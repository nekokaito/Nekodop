async function fetchCats() {
  try {
    const res = await fetch("https://nekodop-server.vercel.app/get-cats");
    const data = await res.json();
    const cats = data.cats;
    const container = document.getElementById("cat-container");

    if (cats.length > 0) {
      const catCards = await Promise.all(
        cats.map(async (cat) => {
          try {
            // Fetch owner details
            const ownerRes = await fetch(
              `https://nekodop-server.vercel.app/get-user/${cat.cat_owner_id}`
            );
            const ownerData = await ownerRes.json();
            const ownerImage =
              ownerData.user.profile_picture || "../images/profile.png";

            return `
              <a href="../pages/cat-details.html?id=${cat.id}">
                <div class="card">
                  <div class="cat-img">
                    <img src="${cat.cat_image}" alt="${cat.cat_name}" />
                  </div>
                  <div class="card-body">
                    <div class="card-text">
                      <h2>${cat.cat_name}</h2>
                      <p>Age: ${cat.cat_age}Y</p>
                      <p>${cat.cat_gender}</p>
                    </div>
                    <div class="owner-img">
                      <img src="${ownerImage}" alt="Owner of ${cat.cat_name}" />
                    </div>
                  </div>
                </div>
              </a>
            `;
          } catch (ownerError) {
            console.error(
              `Error fetching owner details for ${cat.cat_name}:`,
              ownerError
            );
            return "";
          }
        })
      );

      container.innerHTML = catCards.join("");
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
      // Fetch owner details
      let ownerImage = "default-owner.jpg"; // Default if fetch fails
      try {
        const ownerRes = await fetch(
          `https://nekodop-server.vercel.app/get-user/${cat.cat_owner_id}`
        );
        const ownerData = await ownerRes.json();
        ownerImage = ownerData.profile_picture || ownerImage;
      } catch (ownerError) {
        console.error("Error fetching owner details:", ownerError);
      }

      document.getElementById("cat-name").textContent = cat.cat_name;
      document.getElementById("cat-info").innerHTML = `
        <img src="${cat.cat_image}" alt="${cat.cat_name}" />
        <p>Age: ${cat.cat_age}</p>
        <p>Gender: ${cat.cat_gender}</p>
        <p>Description: ${cat.cat_description}</p>
        <div class="owner-details">
          <h3>Owner:</h3>
          <img src="${ownerImage}" alt="Owner of ${cat.cat_name}" />
        </div>
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
