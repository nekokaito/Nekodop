// Get user data from localStorage
export const getUser = () => JSON.parse(localStorage.getItem("user"));

// Check if user is admin
export const checkIsAdmin = async () => {
  const user = getUser();
  if (!user) return false;

  try {
    const res = await fetch(
      `https://nekodop-api.vercel.app/is-admin/${user.id}`
    );
    const data = await res.json();
    return data.isAdmin; // true/false
  } catch (err) {
    console.error("Admin check failed:", err);
    return false;
  }
};
