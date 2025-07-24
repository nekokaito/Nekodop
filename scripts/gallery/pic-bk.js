
export const galleryImages =() => {
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
    ];

    const columns = 3;
    const table = document.getElementById("galleryTable");

    if (table) {
      for (let i = 0; i < images.length; i += columns) {
        const row = document.createElement("tr");

        for (let j = 0; j < columns; j++) {
          const cell = document.createElement("td");
          const imgIndex = i + j;

          if (imgIndex < images.length) {
            const img = document.createElement("img");
            img.src = "/images/for-gallery/" + images[imgIndex];  // Make sure this path is correct!
            img.width = 150;
            img.height = 150;
            img.alt = "Cat " + (imgIndex + 1);
            cell.appendChild(img);
          }

          row.appendChild(cell);
        }

        table.appendChild(row);
      }
    } else {
      console.error('Element with id "galleryTable" not found.');
    }
  }