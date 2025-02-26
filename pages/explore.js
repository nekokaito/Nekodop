export default async function Explore() {
  const res = await fetch("https://nekodop-server.vercel.app/get-cats");
  const data = await res.json();
  const cats = data.cats;
  console.log(typeof cats);
  console.log(cats);
  let content = `
      <h1>Explore Page</h1>
      <p>Discover amazing things here!</p>
      <div class="card-container">
  `;

  if (cats.length > 0) {
    cats.forEach((cat) => {
      content += `
          <div class="card">
              <img src="${cat.cat_image} alt="${cat.cat_name}" />
              <div class="card-text">
                <h2>${cat.cat_name}</h2>
                <p>Age: ${cat.cat_age}</p>
                <p>Gender: ${cat.cat_gender}</p>
                <p>${cat.cat_description}</p>
              </div>
          </div>
      `;
    });
  } else {
    content += `<p>No cats available right now.</p>`;
  }

  content += `</div>`; 

  return content;
}

Explore().then((html) => {
  document.querySelector(".container").innerHTML = html;
});
