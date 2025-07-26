export const galleryImages = () => {
  console.log("Gallery Images Loaded");
  const images = [
    "cat1.jpg",
    "cat2.jpg",
    "cat3.jpg",
    "cat4.jpg",
    "cat5.jpg",
    "cat6.jpg",
    "chill-mewoi.png",
    "chill-mewoi.png",
    "chill-mewoi.png",
    "cat1.jpg",
    "cat2.jpg",
    "cat3.jpg",
    "cat4.jpg",
    "cat5.jpg",
    "cat6.jpg"
  ];
  const galleryContainer = document.querySelector(".gallery-container");
  images.forEach((image) => {
    const imgdiv = document.createElement("div");
    imgdiv.classList.add("gallery-item");
    const imgElement = document.createElement("img");

    imgElement.src = `/images/for-gallery/${image}`;
    imgElement.alt = `Gallery Image ${image}`;
    
    imgdiv.appendChild(imgElement);
    galleryContainer.appendChild(imgdiv);
  });
  console.log("Gallery Images Appended");
};
