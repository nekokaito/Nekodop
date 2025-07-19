let isAdminCache = null;

// Get user data from localStorage
export const getUser = () => JSON.parse(localStorage.getItem("user"));

// Check if user is admin with caching
export const checkIsAdmin = async () => {
  if (isAdminCache !== null) return isAdminCache;

  const user = getUser();
  if (!user) return false;

  try {
    // Request admin status from backend
    const res = await fetch(`http://localhost:5000/is-admin/${user.id}`);
    isAdminCache = await res.json();
    return isAdminCache;
  } catch (err) {
    // Handle errors
    console.error("Admin check failed:", err);
    return false;
  }
};
