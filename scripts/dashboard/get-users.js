import { renderUsers } from "./render-users.js";

export const fetchUsers = async () => {
  try {
    const res = await fetch("http://localhost:5000/get-users");
    const data = await res.json();
    const userList = data.users;
    renderUsers(userList);

    // Update total users count
    const totalUsers = userList.length;
    document.getElementById("total-users").textContent = totalUsers;

    // Update user details in the dashboard
    const user = JSON.parse(localStorage.getItem("user"));
    const userName = user?.name || "Admin";
    const profilePicture = user?.profilePicture || "../images/profile.png";
    document.getElementById("dashboard-username").textContent =
      userName || "Admin";
    document.getElementById("dashboard-profile-picture").src =
      profilePicture || "../images/profile.png";
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};
