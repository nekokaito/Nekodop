require("dotenv").config();
const http = require("http");
const { neon } = require("@neondatabase/serverless");
const sql = neon(process.env.DATABASE_URL);

// Create User
const createUser = async (email, password, profilePicture) => {
  const result = await sql`
    INSERT INTO users (email, password, profile_picture)
    VALUES (${email}, ${password}, ${profilePicture})
    RETURNING id, email, profile_picture;
  `;
  return result[0];
};

// Login validation
const userValidation = async (email) => {
  const result = await sql`
    SELECT * FROM users WHERE email = ${email};
  `;
  return result[0];
};

// Handle User Login
const loginUser = async (email, password) => {
  const user = await userValidation(email);

  if (!user) {
    return { error: "User not found" };
  }

  if (user.password === password) {
    return { success: "Login successful", user };
  } else {
    return { error: "Invalid password" };
  }
};

// Create Cat Post
const createCatPost = async (
  catOwnerId,
  catName,
  catImage,
  catAge,
  catGender,
  catDescription,
  ownerAddress,
  ownerPhone,
  ownerEmail,
  adopted,
  additionalInformation
) => {
  const result = await sql`
    INSERT INTO cats (cat_owner_id, cat_name, cat_image, cat_age, cat_gender, cat_description, owner_address, owner_phone, owner_email, adopted, additional_information)
    VALUES (${catOwnerId}, ${catName}, ${catImage}, ${catAge}, ${catGender}, ${catDescription}, ${ownerAddress}, ${ownerPhone}, ${ownerEmail}, ${adopted}, ${additionalInformation})
    RETURNING id;
  `;
  return result[0];
};

// Get Cats for Adoption
const getCatsForAdoption = async () => {
  const result = await sql`
    SELECT * FROM cats WHERE adopted = FALSE;
  `;
  return result;
};

// Get Cats by Owner ID
const getCatsByOwnerId = async (catOwnerId) => {
  const result = await sql`
    SELECT * FROM cats WHERE cat_owner_id = ${catOwnerId};
  `;
  return result;
};

// Update Cat Post
const updateCatPost = async (
  catId,
  catName,
  catImage,
  catAge,
  catGender,
  catDescription,
  ownerAddress,
  ownerPhone,
  ownerEmail,
  adopted,
  additionalInformation
) => {
  const result = await sql`
    UPDATE cats
    SET cat_name = ${catName}, cat_image = ${catImage}, cat_age = ${catAge}, cat_gender = ${catGender}, cat_description = ${catDescription}, owner_address = ${ownerAddress}, owner_phone = ${ownerPhone}, owner_email = ${ownerEmail}, adopted = ${adopted}, additional_information = ${additionalInformation}
    WHERE id = ${catId}
    RETURNING id;
  `;
  return result[0];
};

// Delete Cat Post
const deleteCatPost = async (catId) => {
  const result = await sql`
    DELETE FROM cats WHERE id = ${catId} RETURNING id;
  `;
  return result[0];
};

// Request Handler
const requestHandler = async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  // Register User
  if (req.method === "POST" && req.url === "/register") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", async () => {
      const { email, password, profilePicture } = JSON.parse(body);
      try {
        const user = await createUser(email, password, profilePicture);
        res.statusCode = 201;
        res.end(JSON.stringify({ message: "User created", user }));
      } catch (error) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: "User creation failed" }));
      }
    });
  }

  // Login User
  if (req.method === "POST" && req.url === "/login") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", async () => {
      const { email, password } = JSON.parse(body);
      try {
        const loginResponse = await loginUser(email, password);

        if (loginResponse.error) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: loginResponse.error }));
        } else {
          res.statusCode = 200;
          res.end(
            JSON.stringify({
              message: loginResponse.success,
              user: loginResponse.user,
            })
          );
        }
      } catch (error) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: "Login failed" }));
      }
    });
  }

  // Create Cat Post
  if (req.method === "POST" && req.url === "/create-cat") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", async () => {
      const {
        catOwnerId,
        catName,
        catImage,
        catAge,
        catGender,
        catDescription,
        ownerAddress,
        ownerPhone,
        ownerEmail,
        adopted,
        additionalInformation,
      } = JSON.parse(body);
      const catPost = await createCatPost(
        catOwnerId,
        catName,
        catImage,
        catAge,
        catGender,
        catDescription,
        ownerAddress,
        ownerPhone,
        ownerEmail,
        adopted,
        additionalInformation
      );
      res.statusCode = 201;
      res.end(JSON.stringify({ message: "Cat posted for adoption", catPost }));
    });
  }

  // Get All Cats for Adoption
  if (req.method === "GET" && req.url === "/get-cats") {
    const cats = await getCatsForAdoption();
    res.statusCode = 200;
    res.end(JSON.stringify({ cats }));
  }

  // Get Cats by Cat Owner ID
  if (req.method === "GET" && req.url.startsWith("/get-cats/")) {
    const catOwnerId = req.url.split("/")[2]; // Extract catOwnerId from the URL
    try {
      const cats = await getCatsByOwnerId(catOwnerId);
      if (cats.length === 0) {
        res.statusCode = 404;
        res.end(JSON.stringify({ message: "No cats found for this owner" }));
      } else {
        res.statusCode = 200;
        res.end(JSON.stringify({ cats }));
      }
    } catch (error) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: "Error fetching cats" }));
    }
  }

  // Update Cat Post
  if (req.method === "PUT" && req.url.startsWith("/update-cat/")) {
    const catId = req.url.split("/")[2];
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", async () => {
      const {
        catName,
        catImage,
        catAge,
        catGender,
        catDescription,
        ownerAddress,
        ownerPhone,
        ownerEmail,
        adopted,
        additionalInformation,
      } = JSON.parse(body);
      const updatedCat = await updateCatPost(
        catId,
        catName,
        catImage,
        catAge,
        catGender,
        catDescription,
        ownerAddress,
        ownerPhone,
        ownerEmail,
        adopted,
        additionalInformation
      );
      res.statusCode = 200;
      res.end(JSON.stringify({ message: "Cat post updated", updatedCat }));
    });
  }

  // Delete Cat Post
  if (req.method === "DELETE" && req.url.startsWith("/delete-cat/")) {
    const catId = req.url.split("/")[2];
    const deletedCat = await deleteCatPost(catId);
    res.statusCode = 200;
    res.end(JSON.stringify({ message: "Cat post deleted", deletedCat }));
  }
};

http.createServer(requestHandler).listen(4000, () => {
  console.log("Server running at http://localhost:4000");
});
