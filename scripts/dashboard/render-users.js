export const renderUsers = (users) => {
  const userContainer = document.getElementById("user-container");
  userContainer.innerHTML = ""; // Clear loading text
  console.log("Rendering users:", users);

  if (users && users.length > 0) {
    users.forEach((user) => {
      const userCard = document.createElement("div");
      userCard.className = "user-card";
      userCard.innerHTML = `
        <h3>${user.name}</h3>
        <p>Email: ${user.email}</p>
      `;
      userContainer.appendChild(userCard);
    });
  } else {
    userContainer.innerHTML = "<p>No users found.</p>";
  }
};
