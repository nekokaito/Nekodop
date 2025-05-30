let cats = [];

// Reusable render function
async function renderCats(catList) {
  const container = document.getElementById("cat-container");

  if (catList.length > 0) {
    const catCards = await Promise.all(
      catList.map(async (cat) => {
        try {
          const ownerRes = await fetch(
            `https://nekodop-server.vercel.app/get-user/${cat.cat_owner_id}`
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
          console.error(`Error fetching owner for ${cat.cat_name}:`, ownerError);
          return "";
        }
      })
    );

    container.innerHTML = catCards.join("");
  } else {
    container.innerHTML = "<p>No cats available right now.</p>";
  }
}

// Fetch all cats
async function fetchCats() {
  try {
    const res = await fetch("https://nekodop-server.vercel.app/get-cats");
    const data = await res.json();
    cats = data.cats;

    renderCats(cats); // Initial render of all cats
  } catch (error) {
    document.getElementById("cat-container").innerHTML =
      "<p>Failed to load cats. Please try again later.</p>";
    console.error("Error fetching cats:", error);
  }
}

// Combined Filter Handler
function applyFilters() {
  const searchQuery = document.getElementById("search-input")?.value.toLowerCase() || "";
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
}

// Initialize on DOM load
document.addEventListener("DOMContentLoaded", () => {
  fetchCats();

  // Event listener for search input
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("input", applyFilters);
  }

  // Event listeners for gender checkboxes
  const maleCheckbox = document.getElementById("male-filter");
  const femaleCheckbox = document.getElementById("female-filter");
  if (maleCheckbox) maleCheckbox.addEventListener("change", applyFilters);
  if (femaleCheckbox) femaleCheckbox.addEventListener("change", applyFilters);
});

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

      try {
        const ownerRes = await fetch(
          `https://nekodop-server.vercel.app/get-user/${cat?.cat_owner_id}`
        );
        const ownerData = await ownerRes.json();
        ownerImage = ownerData.user.profile_picture || "../images/profile.png";
      } catch (ownerError) {
        console.error("Error fetching owner details:", ownerError);
      }

      document.getElementById("cat-info").innerHTML = ` 
<div class="cat-content">
                <div class="cat-image">
                    <img src="${cat.cat_image}" alt="${cat.cat_name}">
                </div>
                
                <div class="cat-info">
                    <h1 class="pet-name">${cat.cat_name}</h1>
                    
                    <div class="pet-details">
                        <p class="detail"><span class="label">Age:</span> 3 years 5 month</p>
                        <p class="detail">
                            <span class="label">gender:</span> ${cat.cat_gender}
                            <svg class="gender-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="8" r="7" stroke="#FF6B8B" stroke-width="2"/>
                                <path d="M12 15V22" stroke="#FF6B8B" stroke-width="2"/>
                                <path d="M9 19H15" stroke="#FF6B8B" stroke-width="2"/>
                            </svg>
                        </p>
                    </div>
                    
                    <div class="pet-description">
                        <p>${cat.cat_description}</p>
                    </div>
                    
                    <div class="more-info">
                        <p><span class="label">moreInfo:</span> vaccinated, cute</p>
                    </div>
                    
                    <div class="action-buttons">
                        <button class="whatsapp-button">
                            Chat on WhatsApp
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.6 6.31999C16.8 5.49999 15.8 4.84999 14.7 4.39999C13.6 3.94999 12.5 3.69999 11.3 3.69999C10 3.69999 8.8 3.99999 7.7 4.49999C6.6 4.99999 5.6 5.69999 4.8 6.49999C4 7.29999 3.3 8.29999 2.9 9.39999C2.4 10.5 2.2 11.7 2.2 12.9C2.2 14.5 2.6 16.1 3.4 17.5L2.1 22.8L7.6 21.5C9 22.3 10.6 22.7 12.2 22.7C13.5 22.7 14.7 22.4 15.8 21.9C16.9 21.4 17.9 20.7 18.7 19.9C19.5 19.1 20.1 18.1 20.6 17C21.1 15.9 21.3 14.7 21.3 13.5C21.3 12.3 21.1 11.1 20.6 10C20.1 8.89999 19.4 7.89999 18.6 7.09999L17.6 6.31999ZM11.3 21.2C9.9 21.2 8.5 20.8 7.3 20.1L6.9 19.8L3.8 20.6L4.6 17.6L4.3 17.2C3.5 15.9 3.1 14.5 3.1 13C3.1 11.9 3.3 10.9 3.7 9.89999C4.1 8.89999 4.7 8.09999 5.4 7.39999C6.1 6.69999 6.9 6.09999 7.9 5.69999C8.9 5.29999 9.9 5.09999 11 5.09999C12 5.09999 13 5.29999 13.9 5.69999C14.8 6.09999 15.6 6.59999 16.3 7.29999C17 7.99999 17.5 8.79999 17.9 9.69999C18.3 10.6 18.5 11.6 18.5 12.6C18.5 13.7 18.3 14.7 17.9 15.7C17.5 16.7 16.9 17.5 16.2 18.2C15.5 18.9 14.7 19.5 13.7 19.9C12.7 20.3 11.7 20.5 10.7 20.5L11.3 21.2ZM15.1 14.5C15.3 14.6 15.4 14.7 15.5 14.8C15.5 14.9 15.5 15.1 15.5 15.2C15.4 15.3 15.4 15.5 15.3 15.6C15.2 15.8 15 15.9 14.8 15.9C14.6 16 14.3 16 14 16C13.7 16 13.4 15.9 13.1 15.8C12.8 15.7 12.5 15.6 12.2 15.4C11.9 15.2 11.6 15 11.3 14.8C11 14.6 10.8 14.3 10.5 14C10.1 13.6 9.79999 13.2 9.49999 12.7C9.19999 12.3 8.99999 11.8 8.79999 11.3C8.69999 11 8.69999 10.7 8.69999 10.4C8.69999 10.2 8.79999 10 8.89999 9.79999C8.99999 9.59999 9.19999 9.5 9.29999 9.4C9.39999 9.3 9.49999 9.29999 9.59999 9.29999H9.79999C9.89999 9.29999 9.99999 9.29999 10.1 9.39999C10.2 9.49999 10.3 9.69999 10.4 9.89999C10.5 10.1 10.7 10.4 10.8 10.7C10.9 10.9 11 11.1 11.1 11.2L11.3 11.5C11.4 11.6 11.4 11.7 11.4 11.9C11.4 12 11.3 12.1 11.3 12.2C11.2 12.3 11.1 12.4 11 12.5C10.9 12.6 10.9 12.7 10.8 12.8C10.7 12.9 10.7 13 10.7 13.1C10.7 13.2 10.8 13.3 10.8 13.4C10.9 13.5 11 13.7 11.1 13.8C11.2 13.9 11.4 14.1 11.6 14.2C11.8 14.4 12 14.5 12.2 14.6C12.3 14.7 12.5 14.7 12.6 14.8C12.7 14.9 12.8 14.9 12.9 14.9C13 14.9 13.1 14.9 13.2 14.8C13.3 14.7 13.4 14.6 13.5 14.5L13.8 14.2C13.9 14.1 14 14 14.2 13.9C14.3 13.8 14.5 13.7 14.6 13.7C14.7 13.7 14.9 13.7 15 13.8C15.1 13.9 15.3 14 15.5 14.1L15.1 14.5Z" fill="white"/>
                            </svg>
                        </button>
                        <button class="email-button">
                            Send an Email
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M22 6L12 13L2 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                    </div>
                    
                    <div class="posted-by">
                        <h3>Posted by</h3>
                        <div class="poster-info">
                            <div class="poster-avatar">
                                <img src="${ownerImage}" alt="Poster avatar">
                            </div>
                            <p class="poster-name">${cat.owner_name}, Dhap, Rangpur</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
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
