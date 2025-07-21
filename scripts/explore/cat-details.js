import { checkIsAdmin } from "../auth/auth-utils.js";

export const fetchCatDetails = async () => {
  const params = new URLSearchParams(window.location.search);
  const catId = params.get("id");
  const isAdmin = await checkIsAdmin();

  if (!catId) return;

  try {
    // Fetch cat details from server
    const res = await fetch(`http://localhost:5000/get-cat/${catId}`);
    const data = await res.json();
    const cat = data.cat;
    

    if (cat) {
      let ownerImage = "../images/profile.png";

      try {
        // Fetch owner details
        const ownerRes = await fetch(
          `http://localhost:5000/get-user/${cat.cat_owner_id}`
        );
        const ownerData = await ownerRes.json();

        ownerImage =
          ownerData?.user?.profile_picture || "../images/profile.png";
      } catch (ownerError) {
        console.error("Error fetching owner details:", ownerError);
      }

      // Format date to readable string
      const date = new Date(cat.created_at);
      const formattedDate = date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      const whatsappLink = `https://api.whatsapp.com/send?phone=88${
        cat.owner_phone
      }&text=Message%20From%20NekoDop:%20Hello,%20I%20would%20like%20to%20ask%20about%20${encodeURIComponent(
        cat.cat_name
      )}`;

      if (isAdmin) {
        const navHome = document.getElementById("nav-home");

        const morePostsLink = document.createElement("a");
        morePostsLink.href = "/pages/dashboard.html#posts";
        morePostsLink.className = "return-btn";
        morePostsLink.innerHTML = `
    <i class="fa-solid fa-file"></i>
    More Posts
  `;

        navHome.appendChild(morePostsLink);
      }

      // cat details in the HTML

      document.getElementById("cat-info").innerHTML = ` 
      
<div class="cat-content">
                <div class="cat-image">
                    <img src="${cat.cat_image}" alt="${cat.cat_name}">
                </div>
                
                <div class="cat-info">
                    <h1 class="pet-name">${cat.cat_name}</h1>
                    
                    <div class="pet-details">
                        <p class="detail"><span class="label">Age:</span> ${
                          cat.cat_age
                        }</p>
                        <p class="detail">
                            <span class="label">Gender:</span> ${cat.cat_gender}
${
  cat.cat_gender.toLowerCase() === "male"
    ? `
  <svg class="gender-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="14" r="5" stroke="#6BAEFF" stroke-width="2"/>
    <path d="M14 10L20 4" stroke="#6BAEFF" stroke-width="2"/>
    <path d="M16 4H20V8" stroke="#6BAEFF" stroke-width="2"/>
  </svg>
`
    : `
  <svg class="gender-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="8" r="7" stroke="#FF6B8B" stroke-width="2"/>
    <path d="M12 15V22" stroke="#FF6B8B" stroke-width="2"/>
    <path d="M9 19H15" stroke="#FF6B8B" stroke-width="2"/>
  </svg>
`
}
                        </p>
                    </div>
                    
                    <div class="pet-description">
                        <p>${cat.cat_description}</p>
                    </div>
                    
                    <div class="more-info">
                        <p><span class="label">Additional Info: </span>${
                          cat?.additional_information
                        }</p>
                    </div>
                    
                    <div class="action-buttons">

                        <button onclick="window.open('${whatsappLink}', '_blank')" class="whatsapp-button">
                            Chat on WhatsApp
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.6 6.31999C16.8 5.49999 15.8 4.84999 14.7 4.39999C13.6 3.94999 12.5 3.69999 11.3 3.69999C10 3.69999 8.8 3.99999 7.7 4.49999C6.6 4.99999 5.6 5.69999 4.8 6.49999C4 7.29999 3.3 8.29999 2.9 9.39999C2.4 10.5 2.2 11.7 2.2 12.9C2.2 14.5 2.6 16.1 3.4 17.5L2.1 22.8L7.6 21.5C9 22.3 10.6 22.7 12.2 22.7C13.5 22.7 14.7 22.4 15.8 21.9C16.9 21.4 17.9 20.7 18.7 19.9C19.5 19.1 20.1 18.1 20.6 17C21.1 15.9 21.3 14.7 21.3 13.5C21.3 12.3 21.1 11.1 20.6 10C20.1 8.89999 19.4 7.89999 18.6 7.09999L17.6 6.31999ZM11.3 21.2C9.9 21.2 8.5 20.8 7.3 20.1L6.9 19.8L3.8 20.6L4.6 17.6L4.3 17.2C3.5 15.9 3.1 14.5 3.1 13C3.1 11.9 3.3 10.9 3.7 9.89999C4.1 8.89999 4.7 8.09999 5.4 7.39999C6.1 6.69999 6.9 6.09999 7.9 5.69999C8.9 5.29999 9.9 5.09999 11 5.09999C12 5.09999 13 5.29999 13.9 5.69999C14.8 6.09999 15.6 6.59999 16.3 7.29999C17 7.99999 17.5 8.79999 17.9 9.69999C18.3 10.6 18.5 11.6 18.5 12.6C18.5 13.7 18.3 14.7 17.9 15.7C17.5 16.7 16.9 17.5 16.2 18.2C15.5 18.9 14.7 19.5 13.7 19.9C12.7 20.3 11.7 20.5 10.7 20.5L11.3 21.2ZM15.1 14.5C15.3 14.6 15.4 14.7 15.5 14.8C15.5 14.9 15.5 15.1 15.5 15.2C15.4 15.3 15.4 15.5 15.3 15.6C15.2 15.8 15 15.9 14.8 15.9C14.6 16 14.3 16 14 16C13.7 16 13.4 15.9 13.1 15.8C12.8 15.7 12.5 15.6 12.2 15.4C11.9 15.2 11.6 15 11.3 14.8C11 14.6 10.8 14.3 10.5 14C10.1 13.6 9.79999 13.2 9.49999 12.7C9.19999 12.3 8.99999 11.8 8.79999 11.3C8.69999 11 8.69999 10.7 8.69999 10.4C8.69999 10.2 8.79999 10 8.89999 9.79999C8.99999 9.59999 9.19999 9.5 9.29999 9.4C9.39999 9.3 9.49999 9.29999 9.59999 9.29999H9.79999C9.89999 9.29999 9.99999 9.29999 10.1 9.39999C10.2 9.49999 10.3 9.69999 10.4 9.89999C10.5 10.1 10.7 10.4 10.8 10.7C10.9 10.9 11 11.1 11.1 11.2L11.3 11.5C11.4 11.6 11.4 11.7 11.4 11.9C11.4 12 11.3 12.1 11.3 12.2C11.2 12.3 11.1 12.4 11 12.5C10.9 12.6 10.9 12.7 10.8 12.8C10.7 12.9 10.7 13 10.7 13.1C10.7 13.2 10.8 13.3 10.8 13.4C10.9 13.5 11 13.7 11.1 13.8C11.2 13.9 11.4 14.1 11.6 14.2C11.8 14.4 12 14.5 12.2 14.6C12.3 14.7 12.5 14.7 12.6 14.8C12.7 14.9 12.8 14.9 12.9 14.9C13 14.9 13.1 14.9 13.2 14.8C13.3 14.7 13.4 14.6 13.5 14.5L13.8 14.2C13.9 14.1 14 14 14.2 13.9C14.3 13.8 14.5 13.7 14.6 13.7C14.7 13.7 14.9 13.7 15 13.8C15.1 13.9 15.3 14 15.5 14.1L15.1 14.5Z" fill="white"/>
                            </svg>
                        </button>
                        
                        
                        <button onclick="location.href='mailto:${
                          cat?.owner_email
                        }'" class="email-button">
                            Send an Email
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M22 6L12 13L2 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                      
                        ${
                          isAdmin
                            ? ` <button data-id="${
                                cat.id
                              }" class="approve-button" ${
                                cat.is_approved === 1
                                  ? "disabled style='opacity:0.6;cursor:not-allowed; background-color: #d1d1d1ff;'"
                                  : ""
                              }>
         ${cat.is_approved === 1 ? "Approved" : "Approve Post"}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 12L11 14L15 10" stroke="#ffffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M21 12C21 16.4183 17.4183 20 13 20C8.58172 20 5 16.4183 5 12C5 7.58172 8.58172 4 13 4C17.4183 4 21 7.58172 21 12Z" stroke="#ffffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <button data-id="${cat.id}" class="reject-button">
        Reject Post
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 9L9 15" stroke="#ffffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M9 9L15 15" stroke="#ffffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M21 12C21 16.4183 17.4183 20 13 20C8.58172 20 5 16.4183 5 12C5 7.58172 8.58172 4 13 4C17.4183 4 21 7.58172 21 12Z" stroke="#ffffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>`
                            : ``
                        }

                       
                    </div>
                    
                    <div class="posted-by">
                        <h3>Posted by</h3>
                        <div class="poster-info">
                            <div class="poster-avatar">
                                <img src="${ownerImage}" alt="Poster avatar">
                            </div>
                            <div> 
                            
                            <p class="poster-name">${cat.owner_name}</p>
                            <p class="poster-text">${cat.owner_address}</p>
                            <p class="poster-text">${formattedDate}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="cat-content">
    <div>
  <h1 class="poster-name">What is Nekodop?</h1>
  <p class="poster-text">Nekodop is a community-driven online platform created to make the process of cat adoption easier, faster, and more accessible for everyone. Whether someone is trying to find a new home for their cat or looking to adopt one, Nekodop serves as a bridge that brings both sides together. The platform allows users to post information about cats available for adoption, including details like the cat’s name, age, gender, description, and images. At the same time, potential adopters can freely explore the listings without needing to register or go through complex procedures. Nekodop focuses on simplicity, transparency, and genuine human connection, all while promoting responsible pet ownership. It’s a place where cat lovers come together for one common goal—giving cats a second chance at a happy home.</p>
  </div>
  </div>
  
         <div class="cat-content"> 
         <div><h1 class="poster-name">Why is Nekodop useful?</h1>
  <p class="poster-text">Nekodop is useful because it removes the barriers that often make pet adoption overwhelming or inaccessible. Traditional adoption platforms or organizations may involve a long registration process, interviews, or delays, which can discourage both adopters and those giving up pets. Nekodop solves this by offering a direct, no-hassle solution that connects real people in real time. It’s designed to be lightweight and fast, making it possible to post or find a cat within minutes. Users don’t need to install an app or create an account—they simply visit the website and start browsing or posting. The platform also ensures transparency by allowing adopters to directly view the contact details of the owner, including their WhatsApp number and email, so that any questions or arrangements can be handled personally. By making the process direct and communication-focused, Nekodop creates a trustworthy space for cat adoption while helping reduce the number of abandoned or stray cats in the community..</p></div>
         </div> 
         <div class="cat-content"> 
         <div><h1 class="poster-name">How can we adopt a cat using Nekodop?</h1>
  <p class="poster-text">Adopting a cat on Nekodop is designed to be as smooth and straightforward as possible. First, you visit the platform and browse through the available cats listed by their current owners. Each listing contains key details such as the cat’s name, age, gender, a photo, and a short description that gives insight into the cat’s personality, background, or special needs. Once you find a cat you’re interested in, you don’t need to sign up or fill out any forms. Instead, you’ll see the owner’s contact information on the post. Nekodop allows you to instantly reach out to the owner through WhatsApp by clicking the provided link, which opens a chat directly, or you can choose to send them an email if that’s more convenient. From there, you can ask questions, set up a meeting, or plan the adoption—all in a way that feels natural and human. This personal approach helps build trust between both parties and ensures the cat finds a loving, suitable new home.</p></div>
         </div>
         <a href="/index.html#support">
         <div class="support-banner">
      <img src="/images/support_banner.jpg" alt="Nekodop Logo" class="nekodop-logo">
                      </div> 
                      </a>
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
