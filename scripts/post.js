const postCat = async (
  catOwnerId,
  catName,
  catImage,
  catAge,
  catGender,
  catDescription,
  ownerName,
  ownerAddress,
  ownerPhone,
  ownerEmail,
  additionalInformation
) => {
  await fetch("https://nekodop-server.vercel.app/create-cat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      catOwnerId,
      catName,
      catImage,
      catAge,
      catGender,
      catDescription,
      ownerName,
      ownerAddress,
      ownerPhone,
      ownerEmail,
      adopted: false,
      additionalInformation,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data) {
        console.log("cat posted successfully:", data);
        document.getElementById("post-form").reset();
      } else {
        console.error("failed to post cat:", data.error);
      }
    })
    .catch((err) => console.error("error:", err));
};

const postForm = document.getElementById("post-form");

if (postForm) {
  postForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData || !userData.id) {
      console.error("no user id found in localstorage");
      return;
    }

    const catOwnerId = userData.id;
    const ownerEmail = userData.email || "not available";
    const ownerName = userData.name || "not available";

    const catName = document.getElementById("cat-name").value.trim();
    const catAge = parseInt(document.getElementById("age").value) || 0;
    const catGender = document.getElementById("gender").value;
    const ownerPhone = document.getElementById("lastName").value.trim();
    const ownerAddress = document.getElementById("address").value.trim();
    const additionalInformation = document
      .getElementById("additional")
      .value.trim();
    const catDescription = document.getElementById("description").value.trim();
    const catImageFile = document.getElementById("cat-image").files[0];

    const handlePhotoUpload = async () => {
      if (!catImageFile) return null;

      const img = new FormData();
      img.append("file", catImageFile);
      img.append("upload_preset", "nekodop");
      img.append("cloud_name", "dyvqe1hgj");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dyvqe1hgj/image/upload",
        {
          method: "POST",
          body: img,
        }
      );

      const uploadedImg = await res.json();
      return uploadedImg.url;
    };

    const catImage = await handlePhotoUpload();

    console.log(
      catOwnerId,
      catName,
      catImage,
      catAge,
      catGender,
      catDescription,
      ownerName,
      ownerAddress,
      ownerPhone,
      ownerEmail,
      additionalInformation
    );
    await postCat(
      catOwnerId,
      catName,
      catImage,
      catAge,
      catGender,
      catDescription,
      ownerName,
      ownerAddress,
      ownerPhone,
      ownerEmail,
      additionalInformation
    );
  });
} else {
  console.error("post form not found in the dom.");
}

console.log("post.js running");
