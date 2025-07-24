export const validatePassword = (password) => {
  password = password.trim(); // sanitize input
  let error = null;

  if (password.length < 8) {
    error = "Password must be at least 8 characters long.";
  } else if (!/[A-Z]/.test(password)) {
    error = "Password must contain at least one uppercase letter.";
  } else if (!/[a-z]/.test(password)) {
    error = "Password must contain at least one lowercase letter.";
  } else if (!/\d/.test(password)) {
    error = "Password must contain at least one digit.";
  } else if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password)) {
    error = "Password must contain at least one special character.";
  }

  return {
    isValid: error === null,
    error,
  };
};
