import { renderUsers } from "./render-users.js";

export const fetchUsers = async () => {
  try {
    const res = await fetch("http://localhost:5000/get-users");
    const data = await res.json();

    const userList = data.users;
    renderUsers(userList);
    console.log("Users fetched successfully:", userList);
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};
