export const renderPosts = async (catList) => {
  // get container element

  const container = document.getElementById("post-container");

  // check if cats exist

  if (catList.length > 0) {
    // create cat cards

    const catCards = await Promise.all(
      catList.map(async (cat) => {
        try {
          // fetch owner data

          const ownerRes = await fetch(
            `http://localhost:5000/get-user/${cat.cat_owner_id}`
          );
          const ownerData = await ownerRes.json();

          // owner image fallback

          const ownerImage =
            ownerData.user.profile_picture || "../images/profile.png";

          // optimize cat image url

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
                    <p>${cat.cat_age}</p>
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
          // error fetching owner

          console.error(
            `Error fetching owner for ${cat.cat_name}:`,
            ownerError
          );
          return "";
        }
      })
    );

    // update container content

    container.innerHTML = catCards.join("");
  } else {
    // no cats message

    container.innerHTML = "<p>No cats available right now.</p>";
  }
};
