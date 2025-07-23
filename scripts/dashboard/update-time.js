const updateTime = () => {
  const now = new Date();

  // Format time
  const timeOptions = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };
  const timeString = now.toLocaleTimeString("en-US", timeOptions);

  // Format date
  const dateOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const dateString = now.toLocaleDateString("en-US", dateOptions);

  document.getElementById("currentTime").textContent = timeString;
  document.getElementById("currentDate").textContent = dateString;
};

document.addEventListener("DOMContentLoaded", () => {
  updateTime();
  setInterval(updateTime, 1000);
});
