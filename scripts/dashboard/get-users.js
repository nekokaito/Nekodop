import { renderUsers } from "./render-users.js";

export const fetchUsers = async () => {
  try {
    const res = await fetch("http://localhost:5000/get-users");
    const data = await res.json();
    const userList = data.users;
    renderUsers(userList);
    const totalUsers = userList.length;
    document.getElementById("total-users").textContent = totalUsers;
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};
