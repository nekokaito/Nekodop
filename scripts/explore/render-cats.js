export const renderCats = async (catList) => {
  const container = document.getElementById("cat-container");

  if (catList.length > 0) {
    const catCards = await Promise.all(
      catList.map(async (cat) => {
        try {
          const ownerRes = await fetch(
            `http://localhost:5000/get-user/${cat.cat_owner_id}`
          );
          const ownerData = await ownerRes.json();
          const ownerImage =
            ownerData.user.profile_picture || "../images/profile.png";
          const optimizedImage = cat.cat_image.replace(
            "/upload/",
            "/upload/f_webp,q_40/"
          );

          return `
            <a href="../pages/cat-details.html?id=${cat.id}">
              <div class="card">
                <div class="cat-img">
                  <img src="${optimizedImage}" alt="${cat.cat_name}" />
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
            `Error fetching owner for ${cat.cat_name}:`,
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
};
