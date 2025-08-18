// delete-user.js

export const deleteUser = async (req_id, user_id) => {
  try {
    const response = await fetch(
      `https://nekodop-api.vercel.app/delete-user/${req_id}/${user_id}`,
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
