let isAdminCache = null;

export const getUser = () => JSON.parse(localStorage.getItem("user"));

export const checkIsAdmin = async () => {
  if (isAdminCache !== null) return isAdminCache;

  const user = getUser();
  if (!user) return false;

  try {
    const res = await fetch(`http://localhost:5000/is-admin/${user.id}`);
    isAdminCache = await res.json(); 
    return isAdminCache;
  } catch (err) {
    console.error("Admin check failed:", err);
    return false;
  }
};
