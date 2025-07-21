// delete-user.js

export const deleteUser = async (req_id, user_id) => {
  try {
    const response = await fetch(
      `http://localhost:5000/delete-user/${req_id}/${user_id}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete user");
    }

    const result = await response.json();
    

    // Optionally, refresh the user list or notify
    showToast("User deleted successfully.", "success");
    return true;
  } catch (error) {
    console.error("Error deleting user:", error);
    showToast("Failed to delete user.", "error");
    return false;
  }
};
