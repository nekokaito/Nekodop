document.addEventListener("DOMContentLoaded", async () => {
  const profileImg = document.querySelector(".profile-container img");
  const profileName = document.querySelector(".profile-info h1");
  const profileEmail = document.querySelector(".profile-info p:nth-of-type(1)");
  const profileDate = document.querySelector(".profile-info p:nth-of-type(2)");

  // fetch user data from localstorage
  const localData = JSON.parse(localStorage.getItem("user"));

  if (!localData || !localData.id) {
    console.error("no user id found in localstorage");
    return;
  }

  console.log(localData.id);

  try {
    const response = await fetch(
      `http://nekodop-server.vercel.app/get-user/${localData.id}`
    );

    if (!response.ok) {
      throw new Error("failed to fetch user data");
    }

    const data = await response.json();
    const userData = data.user;

    if (userData) {
      profileImg.src = userData.profile_picture || "../images/profile.png";
      profileImg.alt = userData.name || "user profile";
      profileName.textContent = userData.name || "username";
      profileEmail.innerHTML = `<i class="fa-solid fa-at"></i> ${
        userData.email || "email@example.com"
      }`;

      if (userData.created_at) {
        const createdDate = new Date(userData.created_at);
        const currentDate = new Date();
        const diffTime = Math.abs(currentDate - createdDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        profileDate.innerHTML = `<i class="fa-regular fa-calendar"></i> joined ${diffDays} days ago`;
      } else {
        profileDate.textContent = "not available";
      }
    }
  } catch (error) {
    console.error("error fetching user data:", error.message);
  }
});

const fetchCats = async () => {
  const localData = JSON.parse(localStorage.getItem("user"));

  if (!localData || !localData.id) {
    console.error("no user id found in localstorage");
    return;
  }

  try {
    const response = await fetch(
      `http://nekodop-server.vercel.app/get-cats/${localData.id}`
    );
    const data = await response.json();
    const cats = data.cats;

    if (cats && cats.length > 0) {
      const catsContainer = document.getElementById("cats-container");
      catsContainer.innerHTML = "";

      cats.forEach((cat) => {
        const catCard = document.createElement("div");
        catCard.classList.add("card");

        catCard.innerHTML = `
        <div class="card-body">
        <div class="cat-info">
            <h3>${cat.cat_name}</h3>
            <p>Age: ${cat.cat_age}</p>
            <p>${cat.cat_gender}</p>
          </div>
          <div class="">
            
          </div>
          </div>
          <img src="${cat.cat_image}" alt="${cat.name}" class="cat-image" />
          
        `;

        // Append the card to the container
        catsContainer.appendChild(catCard);

        // Dropdown functionality
        const dropdownBtn = catCard.querySelector(".dropdown-btn");
        const dropdownMenu = catCard.querySelector(".dropdown-menu");

        dropdownBtn.addEventListener("click", () => {
          dropdownMenu.classList.toggle("show");
        });

        // Event listeners for options
        catCard.querySelector(".adopt-option").addEventListener("click", () => {
          console.log(`Cat ${cat.cat_name} marked as adopted`);
        });

        catCard.querySelector(".edit-option").addEventListener("click", () => {
          console.log(`Editing cat ${cat.cat_name}`);
        });

        catCard
          .querySelector(".delete-option")
          .addEventListener("click", () => {
            console.log(`Deleting cat ${cat.cat_name}`);
          });
      });
    } else {
      const catsContainer = document.getElementById("cats-container");
      catsContainer.innerHTML = "<p>No cats found!</p>";
    }
  } catch (error) {
    console.error("Error fetching cats:", error);
  }
};
const showSection = (sectionId, tabId) => {
  // Hide all sections
  document.getElementById("post-section").style.display = "none";
  document.getElementById("my-cats-section").style.display = "none";

  // Show the selected section
  document.getElementById(sectionId).style.display = "block";

  // Remove active class from all tabs
  document.getElementById("post-tab").classList.remove("active");
  document.getElementById("my-cats-tab").classList.remove("active");

  // Add active class to the clicked tab
  document.getElementById(tabId).classList.add("active");
};

fetchCats();
