export const renderPosts = async (catList) => {
  const container = document.getElementById("post-container");

  // Clear container
  container.innerHTML = "";

  if (catList.length === 0 || catList.length < 0) {
    container.style.height = "100vh";
    container.innerHTML = `
      <div class='no-cats'>
        <img src='/images/No_Cats.png' alt='No Cats Found' />
        <p>No Cat Posts Found.</p>
      </div>`;
    return;
  }

  container.style.height = "auto";

  catList.forEach((cat) => {
    // Optimize image URL
    const optimizedImage = cat.cat_image.replace(
      "/upload/",
      "/upload/f_webp,q_40/"
    );

    // Create card element
    const card = document.createElement("a");
    card.href = `../pages/cat-details.html?id=${cat.id}`;
    card.className = "card";
    card.innerHTML = `
      <div class="cat-img">
        <img src="${optimizedImage}" alt="${cat.cat_name}" loading="lazy" />
      </div>
      <div class="card-body">
        <div class="card-text">
          <h2>${cat.cat_name}</h2>
          <p>${cat.cat_age.replace(/^0 years\s*/, "")}</p>
          <p>${cat.cat_gender}</p>
        </div>
        <div class="owner-img">
          <img id="owner-${cat.id}" src="../images/profile.png" alt="Owner of ${
      cat.cat_name
    }" loading="lazy" />
        </div>
      </div>
    `;

    // Append the card immediately
    container.appendChild(card);

    // Fetch owner data in background and update image
    fetch(`http://localhost:5000/get-user/${cat.cat_owner_id}`)
      .then((res) => res.json())
      .then((ownerData) => {
        const ownerImage =
          ownerData.user?.profile_picture || "../images/profile.png";
        const ownerImgEl = document.getElementById(`owner-${cat.id}`);
        if (ownerImgEl) ownerImgEl.src = ownerImage;
      })
      .catch((err) => {
        console.error(`Error fetching owner for ${cat.cat_name}:`, err);
      });
  });
};
