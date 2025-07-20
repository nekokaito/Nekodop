export const setupAdoptionActions = () => {
  const container = document.getElementById("cat-info"); // Or any parent container of buttons
  container.addEventListener("click", async (e) => {
    const approveBtn = e.target.closest(".approve-button");
    const rejectBtn = e.target.closest(".reject-button");

    if (approveBtn) {
      if (approveBtn.disabled) return;
      const catId = approveBtn.getAttribute("data-id");
      await updateAdoptionStatus(catId, 1);
    } else if (rejectBtn) {
      const catId = rejectBtn.getAttribute("data-id");
      await updateAdoptionStatus(catId, 2);
    }
  });
};

const updateAdoptionStatus = async (catId, isApproved) => {
  try {
    const res = await fetch(`http://localhost:5000/update-cat/${catId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isApproved }),
    });

    const data = await res.json();
    if (res.ok) {
      showToast(
        `Adoption ${isApproved ? "approved" : "rejected"} successfully.`,
        "success"
      );
      setTimeout(() => {
        window.location.href = `/pages/cat-details.html?id=${catId}`;
      }, 3000);
    } else {
      showToast(`${data.error || "Update failed."}`, "error");
    }
  } catch (err) {
    console.error("Error updating adoption:", err);
    showToast("Something went wrong.", "error");
  }
};
