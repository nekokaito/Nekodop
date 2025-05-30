function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");

  if (!container) {
    console.error("Toast container not found in the DOM.");
    return;
  }

  const toast = document.createElement("div");
  toast.classList.add("toast", `toast-${type}`);

  toast.innerHTML = `
    <span>${message}</span>
    <button onclick="this.parentElement.remove()">×</button>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}
