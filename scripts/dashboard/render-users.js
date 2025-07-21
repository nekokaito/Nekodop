import { deleteUser } from "./delete-user.js"; // adjust path if needed

export const renderUsers = (users) => {
  const userContainer = document.getElementById("user-list");
  userContainer.innerHTML = "";

  if (users && users.length > 0) {
    users.forEach((user) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>
          <div class="flex items-center gap-3">
            <div class="avatar">
              <div class="mask-squircle" style="height: 48px; width: 48px;">
                <img
                  src="${user?.profile_picture || "../images/profile.png"}"
                  alt="Avatar"
                  style="height: 100%; width: 100%; object-fit: cover; border-radius: 12px;"
                />
              </div>
            </div>
            <div>
              <div class="font-bold">${user.name}</div>
            </div>
          </div>
        </td>
        <td>
          ${user.email || "N/A"}
          <br />
          <span class="badge badge-ghost badge-sm">${
            user.user_role || "Unknown Role"
          }</span>
        </td>
        <td>${user.created_at || "N/A"}</td>
        <td>
          <button class="delete-btn" data-user-id="${user.id}">Delete</button>
        </td>
      `;

      userContainer.appendChild(row);
    });

    // Add delete button functionality
    
    const deleteButtons = document.querySelectorAll(".delete-btn");
    deleteButtons.forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const userId = e.target.dataset.userId;
        const currentUser = JSON.parse(localStorage.getItem("user")); 
        const reqId = currentUser?.id;

        if (confirm("Are you sure you want to delete this user?")) {
          const success = await deleteUser(reqId, userId);
          if (success) {
            // Reload or re-fetch user list
            location.reload(); 
          }
        }
      });
    });
  } else {
    userContainer.innerHTML = "<p>No users found.</p>";
  }
};
