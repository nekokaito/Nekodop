const showToast = (message, type = "info") => {
  // Function to show a toast notification
  const container = document.getElementById("toast-container");

  if (!container) {
    console.error("Toast container not found in the DOM.");
    return;
  }

  const toast = document.createElement("div");
  toast.classList.add("toast", `toast-${type}`);

  toast.innerHTML = `
    <span>${message}</span>
    
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
};
