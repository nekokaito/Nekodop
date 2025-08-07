// Get user data from localStorage
export const getUser = () => JSON.parse(localStorage.getItem("user"));

// Check if user is admin
export const checkIsAdmin = async () => {
  const user = getUser();
  if (!user) return false;

  try {
    const res = await fetch(`http://localhost:5000/is-admin/${user.id}`);
    const data = await res.json();
    return data; // true/false
  } catch (err) {
    console.error("Admin check failed:", err);
    return false;
  }
};
